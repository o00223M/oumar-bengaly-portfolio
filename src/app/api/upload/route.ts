import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase";
import { UPLOADS_BUCKET } from "@/lib/constants";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB — plafond du bucket Supabase (plan gratuit)

// Returns a signed upload URL so the browser can send the file bytes
// directly to Supabase Storage, bypassing the platform's request body
// size limit on this route (Vercel caps function payloads at 4.5MB).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";
  const size = typeof body?.size === "number" ? body.size : 0;

  const extension = ALLOWED_TYPES[contentType];
  if (!extension) {
    return NextResponse.json(
      { error: "Type de fichier non autorisé." },
      { status: 400 }
    );
  }

  if (size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (50 Mo max)." },
      { status: 400 }
    );
  }

  const filename = `${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .createSignedUploadUrl(filename);

  if (error || !data) {
    return NextResponse.json(
      { error: `Échec de la préparation du téléversement : ${error?.message}` },
      { status: 500 }
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from(UPLOADS_BUCKET)
    .getPublicUrl(filename);

  return NextResponse.json({
    path: data.path,
    token: data.token,
    url: publicUrlData.publicUrl,
    mediaType: contentType.startsWith("video/") ? "VIDEO" : "IMAGE",
  });
}
