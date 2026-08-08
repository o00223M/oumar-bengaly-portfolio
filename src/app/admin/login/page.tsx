import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Connexion admin — Oumar Bengaly",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <p className="font-serif text-lg text-cream/50">Oumar Bengaly</p>
      <h1 className="mt-1 text-2xl font-semibold">Espace d&apos;administration</h1>
      <p className="mt-2 text-sm text-cream/50">Accès réservé</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
