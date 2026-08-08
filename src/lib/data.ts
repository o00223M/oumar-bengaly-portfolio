import { prisma } from "@/lib/prisma";

export async function getPortfolioItems() {
  return prisma.portfolioItem.findMany({ orderBy: { order: "asc" } });
}

export async function getFeaturedPortfolioItems() {
  return prisma.portfolioItem.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
  });
}

export async function getPartners() {
  return prisma.partner.findMany({ orderBy: { order: "asc" } });
}
