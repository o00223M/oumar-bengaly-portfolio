import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oumar Bengaly — Agronomie, climat & jeunesse",
  description:
    "Ingénieur agronome, coordinateur pays Impactus Afrika et facilitateur YOUNGO. Au carrefour de l'agriculture durable, de la communication climat et du leadership jeunesse en Afrique.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
