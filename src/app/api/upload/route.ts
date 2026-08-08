import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServerClient, UPLOADS_BUCKET } from "@/lib/supabase";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Type de fichier non autorisé." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (50 Mo max)." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${crypto.randomUUID()}.${extension}`;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(filename, buffer, { contentType: file.type });

  if (error) {
    return NextResponse.json(
      { error: `Échec du téléversement : ${error.message}` },
      { status: 500 }
    );
  }

  const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(filename);

  return NextResponse.json({
    url: data.publicUrl,
    mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
  });
}
