import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oumar Bengaly — Design graphique, montage vidéo & récits climat/agriculture",
  description:
    "Designer graphique et monteur vidéo, je crée des contenus qui rendent visibles les enjeux agricoles et climatiques africains — fort de mon expertise d'ingénieur agronome, coordinateur pays Impactus Afrika et facilitateur YOUNGO.",
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
