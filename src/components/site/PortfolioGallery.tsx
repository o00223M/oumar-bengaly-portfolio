"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, CATEGORY_LABELS, CategoryValue } from "@/lib/categories";
import RevealOnScroll from "@/components/site/RevealOnScroll";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  category: CategoryValue;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
};

const FILTERS: { value: CategoryValue | "TOUT"; label: string }[] = [
  { value: "TOUT", label: "Tout" },
  ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
];

export default function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState<CategoryValue | "TOUT">("TOUT");
  const [active, setActive] = useState<PortfolioItem | null>(null);

  const filtered = useMemo(
    () => (filter === "TOUT" ? items : items.filter((item) => item.category === filter)),
    [items, filter]
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="portfolio" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <RevealOnScroll>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
            Portfolio
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-green sm:text-4xl">
            Créations visuelles &amp; récits qui racontent l&apos;agriculture et le
            climat africains
          </h2>
        </RevealOnScroll>

        <div className="mt-10 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === f.value
                  ? "bg-terracotta text-cream"
                  : "bg-sand-light text-ink-soft hover:bg-sand"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2, delay: 0 } }}
                whileHover={{ y: -6, transition: { duration: 0.25, delay: 0 } }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index, 8) * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setActive(item)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand-light text-left shadow-black/0 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-xs font-semibold uppercase tracking-wide text-sand">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  <span className="mt-1 font-serif text-lg font-semibold text-cream">
                    {item.title}
                  </span>
                </div>
                {item.mediaType === "VIDEO" && (
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-orange text-white">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M2 1.5v11l10-5.5-10-5.5z" />
                    </svg>
                  </span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-ink-soft">
            Aucun élément dans cette catégorie pour le moment.
          </p>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-cream"
            >
              <div className="relative aspect-video w-full bg-ink">
                {active.mediaType === "VIDEO" && active.mediaUrl.match(/\.(mp4|webm)$/) ? (
                  <video
                    src={active.mediaUrl}
                    controls
                    autoPlay
                    className="h-full w-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.mediaUrl}
                    alt={active.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                  {CATEGORY_LABELS[active.category]}
                </span>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-green">
                  {active.title}
                </h3>
                {active.description && (
                  <p className="mt-3 text-ink-soft">{active.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Fermer"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lg"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
