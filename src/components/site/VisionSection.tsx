"use client";

import { motion } from "framer-motion";
import RevealOnScroll from "@/components/site/RevealOnScroll";
import StatCounter from "@/components/site/StatCounter";
import HoverLift from "@/components/site/HoverLift";
import { SOCIAL_LINKS } from "@/lib/constants";

const STATS = [
  { value: 10000, suffix: "+", label: "Abonnés LinkedIn" },
  { value: 400000, suffix: "+", label: "Impressions générées" },
  { value: 400000, suffix: "+", label: "Abonnés cumulés (LinkedIn & Facebook)" },
  { value: 2, suffix: "", label: "Réseaux panafricains représentés" },
];

export default function VisionSection() {
  return (
    <section id="vision" className="bg-green py-24 text-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sand">
              Ma vision
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              Une Afrique qui régénère ses terres et amplifie la voix de sa jeunesse
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/85">
              Je crois en une Afrique où l&apos;agriculture nourrit les communautés
              tout en régénérant les terres, et où la voix des jeunes façonne les
              politiques climatiques. Mon travail consiste à traduire la science
              agronomique et les enjeux climatiques en récits accessibles, qui
              informent, mobilisent et inspirent l&apos;action, des salles de
              classe de Katibougou aux tables de négociation de la CCNUCC.
            </p>
            <motion.a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mt-8 inline-block rounded-full bg-terracotta px-7 py-3 text-sm font-semibold text-cream hover:bg-terracotta-dark"
            >
              Me suivre sur LinkedIn
            </motion.a>
          </RevealOnScroll>

          <div className="grid grid-cols-2 gap-6">
            {STATS.map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={i * 0.08}>
                <HoverLift className="rounded-2xl border border-cream/15 bg-cream/5 p-6 transition-colors hover:border-orange/40">
                  <p className="font-serif text-4xl font-semibold text-orange sm:text-5xl">
                    <StatCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-cream/75">{stat.label}</p>
                </HoverLift>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
