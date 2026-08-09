"use client";

import { createClient } from "@supabase/supabase-js";
import { UPLOADS_BUCKET } from "@/lib/constants";

let browserClient: ReturnType<typeof createClient> | null = null;

function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définis."
    );
  }

  browserClient = createClient(url, anonKey);
  return browserClient;
}

export async function uploadFileDirect(
  file: File | Blob,
  path: string,
  token: string
) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .uploadToSignedUrl(path, token, file);

  if (error) throw error;
}
