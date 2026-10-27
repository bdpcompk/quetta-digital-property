export type MediaSettings = {
  maxImageMb: number;
  imageFormats: string[];
  maxImages: number;
  maxVideoMb: number;
  videoFormats: string[];
  maxVideos: number;
  maxDuration: number;
  autoCompress: boolean;
  thumbnail: boolean;
};

const MIME_BY_FORMAT: Record<string, string> = {
  JPG: "image/jpeg",
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp",
  GIF: "image/gif",
  HEIC: "image/heic",
  MP4: "video/mp4",
  M4V: "video/x-m4v",
  MOV: "video/quicktime",
  WEBM: "video/webm",
  OGG: "video/ogg",
  AVI: "video/x-msvideo",
};

/** "JPG, PNG, JPEG, WEBP" -> ["JPG", "PNG", "JPEG", "WEBP"] */
export function parseMediaFormats(raw: string | null | undefined, fallback: string): string[] {
  const source = raw && raw.trim() ? raw : fallback;
  const list = source
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  return Array.from(new Set(list));
}

/** Value for an <input type="file" accept="..."> */
export function acceptAttribute(formats: string[], kind: "image" | "video"): string {
  const extensions = formats.map((f) => `.${f.toLowerCase()}`);
  const mimes = formats
    .map((f) => MIME_BY_FORMAT[f])
    .filter((m): m is string => Boolean(m) && m.startsWith(`${kind}/`));
  return Array.from(new Set([...extensions, ...mimes])).join(",");
}

export function isFormatAllowed(file: File, formats: string[]): boolean {
  const ext = file.name.split(".").pop()?.toUpperCase() ?? "";
  if (ext && formats.includes(ext)) return true;
  const mime = (file.type || "").toLowerCase();
  return formats.some((f) => MIME_BY_FORMAT[f] === mime);
}

export const toBytes = (mb: number) => Math.max(1, mb) * 1024 * 1024;

/** Resize + re-encode large photos when "Auto Compress" is on. */
export async function compressImage(file: File, maxSide = 1920, quality = 0.82): Promise<File> {
  const supported = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!supported) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const needsWork = scale < 1 || file.size > 900 * 1024;
    if (!needsWork) {
      bitmap.close?.();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    // Keep the same format so the admin's "Allowed Formats" rule stays valid.
    const type = file.type;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, quality)
    );
    if (!blob || blob.size >= file.size) return file;
    const ext = type === "image/webp" ? ".webp" : type === "image/png" ? ".png" : ".jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + ext;
    return new File([blob], name, { type, lastModified: Date.now() });
  } catch {
    return file;
  }
}

/** Read video length in seconds (null when the browser cannot decode the file). */
export function readVideoDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let done = false;
    const finish = (value: number | null) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), 10000);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      clearTimeout(timer);
      finish(Number.isFinite(video.duration) ? video.duration : null);
    };
    video.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
    video.src = url;
  });
}

/** Capture the first frame so video listings have a preview image. */
export function makeVideoThumbnail(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let done = false;
    let drawTried = false;
    const finish = (value: File | null) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      resolve(value);
    };
    const draw = () => {
      if (drawTried || done) return;
      drawTried = true;
      try {
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;
        const scale = Math.min(1, 1280 / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return finish(null);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) =>
            finish(
              blob
                ? new File([blob], "video-thumb.jpg", { type: "image/jpeg", lastModified: Date.now() })
                : null
            ),
          "image/jpeg",
          0.8
        );
      } catch {
        finish(null);
      }
    };
    const timer = setTimeout(() => finish(null), 12000);
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const target = Number.isFinite(video.duration)
        ? Math.min(1, Math.max(0.1, video.duration / 2))
        : 0.1;
      try {
        video.currentTime = target;
      } catch {
        draw();
      }
    };
    video.onseeked = draw;
    video.onloadeddata = () => {
      clearTimeout(timer);
      draw();
    };
    video.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
    video.src = url;
  });
}
