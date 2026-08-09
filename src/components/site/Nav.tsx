"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";

const LINKS = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#partenaires", label: "Partenaires" },
  { href: "#vision", label: "Ma vision" },
  { href: "#apropos", label: "À propos" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(36,29,21,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <motion.a
          href="#top"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="font-serif text-lg font-semibold tracking-tight text-green"
        >
          Oumar Bengaly
        </motion.a>

        <ul
          className="hidden items-center gap-8 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {LINKS.map((link) => (
            <li key={link.href} className="relative">
              <a
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className="relative text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
              >
                {link.label}
              </a>
              <AnimatePresence>
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-terracotta"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-green px-5 py-2 text-sm font-semibold text-green transition-colors hover:bg-green hover:text-cream md:inline-block"
        >
          Me contacter
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-[2px] w-4 bg-ink transition-transform ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-[2px] w-4 bg-ink transition-transform ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-cream md:hidden"
          >
            <div className="px-5 pb-6">
              <ul className="flex flex-col gap-1 pt-3">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-base font-medium text-ink-soft"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-full bg-green px-5 py-2 text-sm font-semibold text-cream"
              >
                Me contacter
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
