import { SITE_LOCATION, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-green text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-xl font-semibold">Oumar Bengaly</p>
          <p className="mt-1 text-sm text-cream/70">{SITE_LOCATION}</p>
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/85 transition-colors hover:text-terracotta"
          >
            LinkedIn
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/85 transition-colors hover:text-terracotta"
          >
            Facebook
          </a>
          <a
            href="/admin/login"
            className="text-cream/40 transition-colors hover:text-cream/70"
          >
            Admin
          </a>
        </div>
      </div>
      <div className="border-t border-cream/10 px-5 py-4 text-center text-xs text-cream/50 sm:px-8">
        © {new Date().getFullYear()} Oumar Bengaly. Tous droits réservés.
      </div>
    </footer>
  );
}
