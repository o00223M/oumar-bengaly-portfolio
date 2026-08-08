export const CATEGORIES = [
  "DESIGN_GRAPHIQUE",
  "MONTAGE_VIDEO",
  "CONTENU_CLIMAT",
  "CONTENU_AGRICULTURE",
] as const;

export type CategoryValue = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<CategoryValue, string> = {
  DESIGN_GRAPHIQUE: "Design graphique",
  MONTAGE_VIDEO: "Montage vidéo",
  CONTENU_CLIMAT: "Contenu climat",
  CONTENU_AGRICULTURE: "Contenu agriculture",
};
