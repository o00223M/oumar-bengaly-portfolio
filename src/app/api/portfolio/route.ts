import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  category: z.enum(CATEGORIES),
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  mediaUrl: z.string().min(1),
  featured: z.boolean().default(false),
});

export async function GET() {
  const items = await prisma.portfolioItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const maxOrder = await prisma.portfolioItem.aggregate({ _max: { order: true } });
  const item = await prisma.portfolioItem.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? 0) + 1 },
  });

  return NextResponse.json(item, { status: 201 });
}
