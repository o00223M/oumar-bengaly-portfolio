"use client";

import { useState } from "react";
import { CATEGORIES, CATEGORY_LABELS, CategoryValue } from "@/lib/categories";
import { uploadFileDirect } from "@/lib/supabase-browser";
import { generateVideoThumbnail } from "@/lib/video-thumbnail";

type Item = {
  id: string;
  title: string;
  description: string;
  category: CategoryValue;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl: string | null;
  featured: boolean;
  order: number;
};

const EMPTY_FORM = {
  title: "",
  description: "",
  category: CATEGORIES[0] as CategoryValue,
  mediaType: "IMAGE" as "IMAGE" | "VIDEO",
  mediaUrl: "",
  thumbnailUrl: "",
  featured: false,
};

export default function PortfolioManager({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(item: Item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl ?? "",
      featured: item.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function requestSignedUpload(contentType: string, size: number) {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, size }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Échec du téléversement.");
    }
    return res.json() as Promise<{
      path: string;
      token: string;
      url: string;
      mediaType: "IMAGE" | "VIDEO";
    }>;
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const { path, token, url, mediaType } = await requestSignedUpload(
        file.type,
        file.size
      );
      await uploadFileDirect(file, path, token);
      setForm((f) => ({ ...f, mediaUrl: url, mediaType, thumbnailUrl: "" }));

      if (mediaType === "VIDEO") {
        try {
          const thumbBlob = await generateVideoThumbnail(file);
          const thumb = await requestSignedUpload("image/jpeg", thumbBlob.size);
          await uploadFileDirect(thumbBlob, thumb.path, thumb.token);
          setForm((f) => ({ ...f, thumbnailUrl: thumb.url }));
        } catch {
          // Pas bloquant : l'élément reste utilisable sans miniature générée.
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du téléversement.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.mediaUrl) {
      setError("Veuillez téléverser un fichier.");
      return;
    }
    setSaving(true);
    setError(null);

    if (editingId) {
      const res = await fetch(`/api/portfolio/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaving(false);
      if (!res.ok) {
        setError("Échec de la mise à jour.");
        return;
      }
      const updated = await res.json();
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    } else {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaving(false);
      if (!res.ok) {
        setError("Échec de la création.");
        return;
      }
      const created = await res.json();
      setItems((prev) => [...prev, created].sort((a, b) => a.order - b.order));
    }

    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet élément du portfolio ?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
  }

  async function toggleFeatured(item: Item) {
    const res = await fetch(`/api/portfolio/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  }

  async function move(item: Item, direction: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((it) => it.id === item.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const other = sorted[swapIndex];

    const [resA, resB] = await Promise.all([
      fetch(`/api/portfolio/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: other.order }),
      }),
      fetch(`/api/portfolio/${other.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: item.order }),
      }),
    ]);
    if (!resA.ok || !resB.ok) return;
    const updatedA = await resA.json();
    const updatedB = await resB.json();
    setItems((prev) =>
      prev
        .map((it) => {
          if (it.id === updatedA.id) return updatedA;
          if (it.id === updatedB.id) return updatedB;
          return it;
        })
        .sort((a, b) => a.order - b.order)
    );
  }

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Portfolio</h1>
      <p className="mt-1 text-sm text-cream/50">
        Ajoutez, modifiez ou supprimez vos créations. Elles apparaissent
        automatiquement sur le site public.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-cream/10 bg-cream/5 p-6"
      >
        <h2 className="font-semibold">
          {editingId ? "Modifier l'élément" : "Ajouter un élément"}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-cream/60">Titre</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-cream/20 bg-transparent px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-sm text-cream/60">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as CategoryValue }))
              }
              className="mt-1 w-full rounded-lg border border-cream/20 bg-ink px-3 py-2 outline-none focus:border-terracotta"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-cream/60">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-cream/20 bg-transparent px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-cream/60">
              Fichier (image ou vidéo)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              className="mt-1 w-full text-sm text-cream/70 file:mr-4 file:rounded-full file:border-0 file:bg-terracotta file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream"
            />
            {uploading && <p className="mt-2 text-sm text-cream/50">Téléversement…</p>}
            {form.mediaUrl && !uploading && (
              <div className="mt-3 flex items-center gap-3">
                {form.mediaType === "IMAGE" || form.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.thumbnailUrl || form.mediaUrl}
                    alt="Aperçu"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-cream/10 text-xs">
                    Vidéo
                  </span>
                )}
                <span className="text-xs text-cream/40">{form.mediaUrl}</span>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="h-4 w-4 accent-terracotta"
            />
            Mettre en avant
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : editingId ? "Mettre à jour" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-cream/20 px-6 py-2.5 text-sm font-semibold"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 space-y-3">
        {sortedItems.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-cream/10 bg-cream/5 p-4"
          >
            {item.mediaType === "IMAGE" || item.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnailUrl || item.mediaUrl}
                alt={item.title}
                className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-cream/10 text-xs">
                Vidéo
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.title}</p>
              <p className="text-xs text-cream/50">
                {CATEGORY_LABELS[item.category]}
                {item.featured && " · Mis en avant"}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(item, -1)}
                disabled={i === 0}
                aria-label="Monter"
                className="rounded-full p-2 text-cream/60 hover:bg-cream/10 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(item, 1)}
                disabled={i === sortedItems.length - 1}
                aria-label="Descendre"
                className="rounded-full p-2 text-cream/60 hover:bg-cream/10 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => toggleFeatured(item)}
                aria-label="Mettre en avant"
                className={`rounded-full p-2 hover:bg-cream/10 ${
                  item.featured ? "text-orange" : "text-cream/40"
                }`}
              >
                ★
              </button>
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full px-3 py-1.5 text-sm text-cream/70 hover:bg-cream/10"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="rounded-full px-3 py-1.5 text-sm text-terracotta hover:bg-terracotta/10"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {sortedItems.length === 0 && (
          <p className="text-sm text-cream/40">Aucun élément pour le moment.</p>
        )}
      </div>
    </div>
  );
}
