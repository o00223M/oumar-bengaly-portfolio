"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/partners", label: "Partenaires" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-cream/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
            Administration
          </p>
          <p className="font-serif text-lg font-semibold">Oumar Bengaly</p>
        </div>

        <nav className="flex items-center gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-terracotta text-cream"
                  : "text-cream/70 hover:bg-cream/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-full px-4 py-2 text-sm font-medium text-cream/50 hover:bg-cream/10"
          >
            Voir le site ↗
          </a>
          <button
            type="button"
            onClick={logout}
            className="ml-2 rounded-full border border-cream/20 px-4 py-2 text-sm font-medium text-cream/70 hover:border-cream/40"
          >
            Se déconnecter
          </button>
        </nav>
      </div>
    </header>
  );
}
