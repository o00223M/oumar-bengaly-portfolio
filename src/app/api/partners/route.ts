import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().min(1),
  websiteUrl: z.string().optional().nullable(),
});

export async function GET() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const maxOrder = await prisma.partner.aggregate({ _max: { order: true } });
  const partner = await prisma.partner.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? 0) + 1 },
  });

  return NextResponse.json(partner, { status: 201 });
}
