"use client";

import { useState } from "react";
import { uploadFileDirect } from "@/lib/supabase-browser";

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  order: number;
};

const EMPTY_FORM = { name: "", logoUrl: "", websiteUrl: "" };

export default function PartnersManager({ initialPartners }: { initialPartners: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(partner: Partner) {
    setEditingId(partner.id);
    setForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    const signRes = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, size: file.size }),
    });

    if (!signRes.ok) {
      setUploading(false);
      setError("Échec du téléversement.");
      return;
    }

    const { path, token, url } = await signRes.json();

    try {
      await uploadFileDirect(file, path, token);
      setForm((f) => ({ ...f, logoUrl: url }));
    } catch {
      setError("Échec du téléversement vers le stockage.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.logoUrl) {
      setError("Veuillez téléverser un logo.");
      return;
    }
    setSaving(true);
    setError(null);

    if (editingId) {
      const res = await fetch(`/api/partners/${editingId}`, {
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
      setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const res = await fetch("/api/partners", {
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
      setPartners((prev) => [...prev, created].sort((a, b) => a.order - b.order));
    }

    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    setPartners((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/partners/${id}`, { method: "DELETE" });
  }

  async function move(partner: Partner, direction: -1 | 1) {
    const sorted = [...partners].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((p) => p.id === partner.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const other = sorted[swapIndex];

    const [resA, resB] = await Promise.all([
      fetch(`/api/partners/${partner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: other.order }),
      }),
      fetch(`/api/partners/${other.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: partner.order }),
      }),
    ]);
    if (!resA.ok || !resB.ok) return;
    const updatedA = await resA.json();
    const updatedB = await resB.json();
    setPartners((prev) =>
      prev
        .map((p) => {
          if (p.id === updatedA.id) return updatedA;
          if (p.id === updatedB.id) return updatedB;
          return p;
        })
        .sort((a, b) => a.order - b.order)
    );
  }

  const sorted = [...partners].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Partenaires</h1>
      <p className="mt-1 text-sm text-cream/50">
        Gérez les logos affichés dans le bandeau défilant du site public.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-cream/10 bg-cream/5 p-6"
      >
        <h2 className="font-semibold">
          {editingId ? "Modifier le partenaire" : "Ajouter un partenaire"}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-cream/60">Nom</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-cream/20 bg-transparent px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-sm text-cream/60">
              Site web (optionnel)
            </label>
            <input
              value={form.websiteUrl}
              onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-cream/20 bg-transparent px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-cream/60">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              className="mt-1 w-full text-sm text-cream/70 file:mr-4 file:rounded-full file:border-0 file:bg-terracotta file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream"
            />
            {uploading && <p className="mt-2 text-sm text-cream/50">Téléversement…</p>}
            {form.logoUrl && !uploading && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoUrl}
                alt="Aperçu"
                className="mt-3 h-14 w-auto rounded-lg bg-cream/10 object-contain p-2"
              />
            )}
          </div>
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
        {sorted.map((partner, i) => (
          <div
            key={partner.id}
            className="flex items-center gap-4 rounded-xl border border-cream/10 bg-cream/5 p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="h-12 w-20 flex-shrink-0 rounded-lg bg-cream/10 object-contain p-1"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{partner.name}</p>
              {partner.websiteUrl && (
                <p className="truncate text-xs text-cream/50">{partner.websiteUrl}</p>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(partner, -1)}
                disabled={i === 0}
                aria-label="Monter"
                className="rounded-full p-2 text-cream/60 hover:bg-cream/10 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(partner, 1)}
                disabled={i === sorted.length - 1}
                aria-label="Descendre"
                className="rounded-full p-2 text-cream/60 hover:bg-cream/10 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => startEdit(partner)}
                className="rounded-full px-3 py-1.5 text-sm text-cream/70 hover:bg-cream/10"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(partner.id)}
                className="rounded-full px-3 py-1.5 text-sm text-terracotta hover:bg-terracotta/10"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-sm text-cream/40">Aucun partenaire pour le moment.</p>
        )}
      </div>
    </div>
  );
}
