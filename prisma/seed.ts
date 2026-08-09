import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const portfolioItems = [
  {
    title: "Identité visuelle : Campagne Sols Vivants",
    description:
      "Système graphique complet pour une campagne de sensibilisation à la santé des sols au Sahel.",
    category: "DESIGN_GRAPHIQUE" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/design-1.svg",
    featured: true,
    order: 1,
  },
  {
    title: "Affiches : Journée mondiale de l'alimentation",
    description: "Série d'affiches pédagogiques pour les universités partenaires.",
    category: "DESIGN_GRAPHIQUE" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/design-2.svg",
    featured: false,
    order: 2,
  },
  {
    title: "Cartes postales : Agriculture régénératrice",
    description: "Illustrations diffusées lors des ateliers Impactus Afrika.",
    category: "DESIGN_GRAPHIQUE" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/design-3.svg",
    featured: false,
    order: 3,
  },
  {
    title: "Récap COP : Voix des jeunes africains",
    description: "Montage vidéo résumant les interventions de la délégation YOUNGO.",
    category: "MONTAGE_VIDEO" as const,
    mediaType: "VIDEO" as const,
    mediaUrl: "/placeholders/video-1.svg",
    featured: true,
    order: 4,
  },
  {
    title: "Portrait : Catalyseurs d'Impact Mali",
    description: "Série de portraits vidéo de l'équipe nationale.",
    category: "MONTAGE_VIDEO" as const,
    mediaType: "VIDEO" as const,
    mediaUrl: "/placeholders/video-2.svg",
    featured: false,
    order: 5,
  },
  {
    title: "Mini-documentaire : Katibougou, terre d'apprentissage",
    description: "Format court sur la vie étudiante à l'IPR/IFRA.",
    category: "MONTAGE_VIDEO" as const,
    mediaType: "VIDEO" as const,
    mediaUrl: "/placeholders/video-3.svg",
    featured: false,
    order: 6,
  },
  {
    title: "Décrypter les rapports du GIEC pour l'Afrique",
    description: "Série de publications pédagogiques sur les enjeux climatiques régionaux.",
    category: "CONTENU_CLIMAT" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/climat-1.svg",
    featured: true,
    order: 7,
  },
  {
    title: "Fil LinkedIn : Financement climat et jeunesse",
    description: "Contenu publié dans le cadre du groupe Alimentation & Agriculture de YOUNGO.",
    category: "CONTENU_CLIMAT" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/climat-2.svg",
    featured: false,
    order: 8,
  },
  {
    title: "Adaptation climatique : Témoignages du Sahel",
    description: "Format carrousel sur les stratégies d'adaptation des producteurs locaux.",
    category: "CONTENU_CLIMAT" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/climat-3.svg",
    featured: false,
    order: 9,
  },
  {
    title: "Agroécologie : Pratiques des jeunes agripreneurs",
    description: "Reportage photo sur les innovations agroécologiques au Mali.",
    category: "CONTENU_AGRICULTURE" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/agri-1.svg",
    featured: true,
    order: 10,
  },
  {
    title: "Sécurité alimentaire : Chaînes de valeur locales",
    description: "Analyse vulgarisée des filières agricoles maliennes.",
    category: "CONTENU_AGRICULTURE" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/agri-2.svg",
    featured: false,
    order: 11,
  },
  {
    title: "Semences et résilience : Cycle de publications",
    description: "Contenu éducatif sur la conservation des semences paysannes.",
    category: "CONTENU_AGRICULTURE" as const,
    mediaType: "IMAGE" as const,
    mediaUrl: "/placeholders/agri-3.svg",
    featured: false,
    order: 12,
  },
];

const partners = [
  { name: "Impactus Afrika", logoUrl: "/placeholders/partner-2.svg", order: 1 },
  { name: "YOUNGO", logoUrl: "/placeholders/partner-3.svg", order: 2 },
  { name: "IPR/IFRA Katibougou", logoUrl: "/placeholders/partner-4.svg", order: 3 },
  { name: "AgriMali", logoUrl: "/placeholders/partner-1.svg", order: 4 },
  { name: "Terre Verte", logoUrl: "/placeholders/partner-5.svg", order: 5 },
  { name: "Sahel Climat", logoUrl: "/placeholders/partner-6.svg", order: 6 },
];

async function main() {
  await prisma.portfolioItem.deleteMany();
  await prisma.partner.deleteMany();

  for (const item of portfolioItems) {
    await prisma.portfolioItem.create({ data: item });
  }
  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }

  console.log(`Créé ${portfolioItems.length} éléments de portfolio et ${partners.length} partenaires.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
