"use client";

import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-green text-cream"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/placeholders/hero.svg')" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-green via-green/60 to-green/20"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-28 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-sand"
        >
          Agronomie · Climat · Leadership jeunesse
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl"
        >
          Cultiver la résilience climatique en Afrique, une voix et une récolte à la fois.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl text-lg text-cream/85"
        >
          Ingénieur agronome, coordinateur pays d&apos;Impactus Afrika au Mali et
          facilitateur au sein de YOUNGO — je relie science agricole, politique
          climatique et récits qui mobilisent la jeunesse africaine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4 pt-2"
        >
          <a
            href="#portfolio"
            className="rounded-full bg-terracotta px-7 py-3 text-sm font-semibold text-cream shadow-lg shadow-terracotta/20 transition-transform hover:-translate-y-0.5 hover:bg-terracotta-dark"
          >
            Découvrir mon travail
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-cream/40 px-7 py-3 text-sm font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
          >
            Me suivre sur LinkedIn
          </a>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/60 sm:flex"
      >
        <span className="text-xs uppercase tracking-[0.25em]">Défiler</span>
        <span className="h-8 w-px animate-pulse bg-cream/50" />
      </motion.div>
    </section>
  );
}
