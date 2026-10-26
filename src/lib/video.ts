export type VideoEmbed =
  | { kind: "iframe"; src: string }
  | { kind: "file"; src: string };

/** Convert a YouTube / Vimeo / direct video URL into an embeddable player source. */
export function getVideoEmbed(url: string | null | undefined): VideoEmbed | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;

  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };

  const vimeo = u.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };

  if (/\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(u)) return { kind: "file", src: u };

  return null;
}
