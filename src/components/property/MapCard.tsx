"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const COORDS: Record<string, [number, number]> = {
  Quetta: [30.1575, 66.9905],
  Gwadar: [25.1268, 62.3467],
  Turbat: [26.0012, 63.083],
  Khuzdar: [27.812, 66.6686],
  Chaman: [31.1807, 66.201],
  Panjgur: [26.972, 64.116],
  Lasbela: [25.846, 66.617],
  Sibi: [29.4749, 67.849],
  Zhob: [31.34, 69.448],
  Kech: [26.0012, 63.083],
  Pishin: [30.5333, 66.975],
  Mastung: [29.735, 66.85],
  Kalat: [29.094, 67.212],
  Loralai: [30.37, 68.55],
  Barkhan: [29.88, 69.65],
  Kohlu: [29.84, 69.25],
  "Dera Bugti": [29.03, 69.17],
  Nushki: [29.55, 66.02],
  Chagai: [29.3, 64.85],
  Washuk: [28.4, 64.2],
  Awaran: [28.9, 65.4],
  Kharan: [28.58, 65.42],
  Harnai: [30.1, 68.35],
  Musakhel: [30.35, 68.7],
  "Killa Saifullah": [30.7, 69.35],
  "Killa Abdullah": [31.12, 67.15],
  "Jhal Magsi": [28.6, 67.75],
  "Sherani": [30.5, 69.85],
  "Duki": [30.15, 68.55],
};

export default function MapCard({ district, address }: { district: string; address: string }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !holder.current) return;
      const [lat, lng] = COORDS[district] ?? COORDS.Quetta;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.marker([lat, lng]).addTo(map).bindPopup(address || district).openPopup();
      const t = setTimeout(() => map.invalidateSize(), 250);
      cleanup = () => {
        clearTimeout(t);
        map.remove();
      };
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [district, address]);

  return <div ref={holder} className="mt-4 h-[300px] w-full overflow-hidden rounded-xl" />;
}
