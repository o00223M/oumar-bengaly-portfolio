export function generateVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    const cleanup = () => URL.revokeObjectURL(video.src);

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, (video.duration || 1) * 0.25);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        cleanup();
        reject(new Error("Canvas indisponible."));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) resolve(blob);
          else reject(new Error("Échec de la génération de la miniature."));
        },
        "image/jpeg",
        0.82
      );
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Impossible de lire le fichier vidéo."));
    };
  });
}
