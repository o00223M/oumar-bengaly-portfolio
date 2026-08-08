import RevealOnScroll from "@/components/site/RevealOnScroll";

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
};

export default function PartnersMarquee({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  const loop = [...partners, ...partners];

  return (
    <section id="partenaires" className="bg-sand-light py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <RevealOnScroll className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
            Partenaires
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-green sm:text-4xl">
            Ils m&apos;ont fait confiance
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            Organisations et institutions avec lesquelles j&apos;ai collaboré.
          </p>
        </RevealOnScroll>
      </div>

      <div className="group relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused]">
          {loop.map((partner, i) => (
            <a
              key={`${partner.id}-${i}`}
              href={partner.websiteUrl ?? undefined}
              target={partner.websiteUrl ? "_blank" : undefined}
              rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
              className="flex h-16 w-40 flex-shrink-0 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              aria-label={partner.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="max-h-16 w-auto object-contain"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
