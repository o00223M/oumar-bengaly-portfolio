import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "placeholders");
mkdirSync(outDir, { recursive: true });

const BLACK = "#000000";
const CHARCOAL = "#1c1c1e";
const PURPLE = "#8b5cf6";
const PURPLE_DARK = "#6d28d9";
const ORANGE = "#ff8a3d";
const ORANGE_DARK = "#e35d1f";

const PALETTES = [
  [BLACK, CHARCOAL],
  [PURPLE, PURPLE_DARK],
  [CHARCOAL, PURPLE_DARK],
  [PURPLE_DARK, BLACK],
  [BLACK, ORANGE_DARK],
  [CHARCOAL, ORANGE],
];

const FONT = "-apple-system, Helvetica, Arial, sans-serif";

const ICONS = {
  leaf: `<path d="M100 150c-20-40-10-80 30-100 40-20 80-10 90 20-40 0-70 20-80 50-10 25-25 40-40 30z" fill="rgba(255,255,255,0.92)"/>`,
  play: `<circle cx="100" cy="100" r="42" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="4"/><path d="M90 82l32 18-32 18z" fill="rgba(255,255,255,0.92)"/>`,
  brush: `<path d="M70 130l60-60 20 20-60 60z" fill="rgba(255,255,255,0.92)"/><circle cx="66" cy="134" r="12" fill="rgba(255,255,255,0.92)"/>`,
  cloud: `<path d="M60 120a24 24 0 010-48 30 30 0 0158-8 22 22 0 01-2 56H60z" fill="rgba(255,255,255,0.92)"/>`,
};

function svgCard({ colorA, colorB, icon, label, id }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colorA}"/>
      <stop offset="1" stop-color="${colorB}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g${id})"/>
  <g transform="translate(100,50) scale(1)">${icon}</g>
  <text x="24" y="270" font-family="${FONT}" font-weight="600" font-size="19" fill="rgba(255,255,255,0.95)">${label}</text>
</svg>`;
}

function svgLogo({ label, id }) {
  const accents = [PURPLE, ORANGE, CHARCOAL, PURPLE_DARK, ORANGE_DARK, BLACK];
  const accent = accents[id % accents.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 90" width="220" height="90">
  <circle cx="34" cy="45" r="16" fill="${accent}"/>
  <text x="60" y="52" font-family="${FONT}" font-size="21" font-weight="700" fill="#1d1d1f">${label}</text>
</svg>`;
}

const items = [
  { file: "design-1.svg", icon: "brush", label: "Design graphique" },
  { file: "design-2.svg", icon: "brush", label: "Design graphique" },
  { file: "design-3.svg", icon: "brush", label: "Design graphique" },
  { file: "video-1.svg", icon: "play", label: "Montage vidéo" },
  { file: "video-2.svg", icon: "play", label: "Montage vidéo" },
  { file: "video-3.svg", icon: "play", label: "Montage vidéo" },
  { file: "climat-1.svg", icon: "cloud", label: "Contenu climat" },
  { file: "climat-2.svg", icon: "cloud", label: "Contenu climat" },
  { file: "climat-3.svg", icon: "cloud", label: "Contenu climat" },
  { file: "agri-1.svg", icon: "leaf", label: "Contenu agriculture" },
  { file: "agri-2.svg", icon: "leaf", label: "Contenu agriculture" },
  { file: "agri-3.svg", icon: "leaf", label: "Contenu agriculture" },
];

items.forEach((item, i) => {
  const [colorA, colorB] = PALETTES[i % PALETTES.length];
  const svg = svgCard({
    colorA,
    colorB,
    icon: ICONS[item.icon],
    label: item.label,
    id: i,
  });
  writeFileSync(path.join(outDir, item.file), svg, "utf8");
});

const partners = [
  "AgriMali",
  "Impactus Afrika",
  "YOUNGO",
  "Katibougou IPR/IFRA",
  "Terre Verte",
  "Sahel Climat",
];
partners.forEach((name, i) => {
  const svg = svgLogo({ label: name, id: i });
  writeFileSync(
    path.join(outDir, `partner-${i + 1}.svg`),
    svg,
    "utf8"
  );
});

const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <radialGradient id="glowPurple" cx="0.22" cy="0.28" r="0.55">
      <stop offset="0" stop-color="${PURPLE}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${PURPLE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowOrange" cx="0.82" cy="0.78" r="0.5">
      <stop offset="0" stop-color="${ORANGE}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="900" fill="${BLACK}"/>
  <rect width="1200" height="900" fill="url(#glowPurple)"/>
  <rect width="1200" height="900" fill="url(#glowOrange)"/>
  <g opacity="0.35" fill="none" stroke="${PURPLE}" stroke-width="1.5">
    <path d="M100 700 Q 400 500 700 650 T 1150 550"/>
  </g>
  <g opacity="0.25" fill="none" stroke="${ORANGE}" stroke-width="1.5">
    <path d="M50 780 Q 400 620 750 760 T 1180 680"/>
  </g>
</svg>`;
writeFileSync(path.join(outDir, "hero.svg"), hero, "utf8");

console.log("Placeholders generated in", outDir);
