import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: z.string().min(1).optional(),
  websiteUrl: z.string().optional().nullable(),
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

  const partner = await prisma.partner
    .update({ where: { id }, data: parsed.data })
    .catch(() => null);

  if (!partner) {
    return NextResponse.json({ error: "Partenaire introuvable." }, { status: 404 });
  }

  return NextResponse.json(partner);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.partner.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
