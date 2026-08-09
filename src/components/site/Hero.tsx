"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 24 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 24 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseMove={handleMouseMove}
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-green text-cream"
    >
      <motion.div
        aria-hidden
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-90"
      >
        <div
          className="h-[124%] w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholders/hero.svg')" }}
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-green via-green/60 to-green/20"
      />
      <motion.div
        aria-hidden
        style={{ left: glowX, top: glowY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute -z-[5] h-[520px] w-[520px] rounded-full bg-terracotta/25 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={{ left: glowX, top: glowY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute -z-[5] h-[220px] w-[220px] rounded-full bg-orange/20 blur-[90px]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-28 sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-sand"
        >
          Design graphique · Montage vidéo · Création de contenu
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl"
        >
          Je donne forme aux idées — en image, en vidéo, en récit.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl text-lg text-cream/85"
        >
          Designer graphique et monteur vidéo, je crée des contenus pour des
          causes et des marques variées — avec un engagement particulier pour
          l&apos;agriculture et le climat, fort de mon expertise d&apos;ingénieur
          agronome, coordinateur pays d&apos;Impactus Afrika et facilitateur au
          sein de YOUNGO.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4 pt-2"
        >
          <motion.a
            href="#portfolio"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="rounded-full bg-terracotta px-7 py-3 text-sm font-semibold text-cream shadow-lg shadow-terracotta/20 hover:bg-terracotta-dark"
          >
            Découvrir mon travail
          </motion.a>
          <motion.a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="rounded-full border border-cream/40 px-7 py-3 text-sm font-semibold text-cream hover:border-cream hover:bg-cream/10"
          >
            Me suivre sur LinkedIn
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#portfolio"
        aria-label="Défiler vers le portfolio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:flex"
      >
        <span className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-cream/40 p-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-orange"
            animate={{ y: [0, 16, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
