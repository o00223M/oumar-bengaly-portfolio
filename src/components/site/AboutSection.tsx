import RevealOnScroll from "@/components/site/RevealOnScroll";
import HoverLift from "@/components/site/HoverLift";

const ROLES = [
  {
    title: "Ingénieur Agronome",
    org: "IPR/IFRA Katibougou · diplôme 2026",
    detail:
      "Formation en ingénierie agronomique, licence en agriculture durable obtenue au sein du même institut.",
  },
  {
    title: "Coordinateur Pays, Mali",
    org: "Impactus Afrika",
    detail:
      "Représentation officielle du pays, direction d'une équipe nationale de Catalyseurs d'Impact, collaboration avec ministères, universités et partenaires.",
  },
  {
    title: "Facilitateur Communication",
    org: "YOUNGO · CCNUCC, groupe Alimentation & Agriculture",
    detail:
      "Sélectionné en 2026 pour animer la communication et la sensibilisation de la constituante jeunesse officielle de la CCNUCC.",
  },
];

export default function AboutSection() {
  return (
    <section id="apropos" className="bg-sand-light py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <RevealOnScroll>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
            À propos
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-green sm:text-4xl">
            Un ingénieur au carrefour de l&apos;agronomie, du climat et de la jeunesse
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft">
            Oumar Bengaly est étudiant en dernière année d&apos;Ingénierie Agronomique
            à l&apos;IPR/IFRA de Katibougou, titulaire d&apos;une licence en agriculture
            durable de la même institution. Il met cette expertise technique au
            service de deux réseaux panafricains de jeunesse engagés sur le climat
            et les systèmes alimentaires.
          </p>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ROLES.map((role, i) => (
            <RevealOnScroll key={role.title} delay={i * 0.1}>
              <HoverLift className="h-full rounded-2xl border border-ink/10 bg-cream p-7 transition-shadow hover:shadow-xl hover:shadow-ink/5">
                <h3 className="font-serif text-xl font-semibold text-green">
                  {role.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-terracotta">
                  {role.org}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {role.detail}
                </p>
              </HoverLift>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
