import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  mediaType: z.enum(["IMAGE", "VIDEO"]).optional(),
  mediaUrl: z.string().min(1).optional(),
  thumbnailUrl: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const item = await prisma.portfolioItem
    .update({ where: { id }, data: parsed.data })
    .catch(() => null);

  if (!item) {
    return NextResponse.json({ error: "Élément introuvable." }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.portfolioItem.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
