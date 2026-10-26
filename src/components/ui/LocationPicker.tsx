"use client";

import { useCallback, useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT: [number, number] = [30.1575, 66.9905];

export default function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const initial = useRef({ lat, lng });
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  const bindDrag = useCallback((marker: Leaflet.Marker) => {
    marker.off("dragend");
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onChangeRef.current(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });
  }, []);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    let cancelled = false;
    let map: Leaflet.Map | null = null;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !holder.current) return;
      LRef.current = L;

      const start: [number, number] =
        Number.isFinite(initial.current.lat) && Number.isFinite(initial.current.lng)
          ? [Number(initial.current.lat), Number(initial.current.lng)]
          : DEFAULT;
      const zoom = Number.isFinite(initial.current.lat) ? 15 : 11;

      map = L.map(el, { scrollWheelZoom: false }).setView(start, zoom);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (Number.isFinite(initial.current.lat) && Number.isFinite(initial.current.lng)) {
        markerRef.current = L.marker(start, { draggable: true }).addTo(map);
        bindDrag(markerRef.current);
      }

      map.on("click", (e: Leaflet.LeafletMouseEvent) => {
        const la = Number(e.latlng.lat.toFixed(6));
        const ln = Number(e.latlng.lng.toFixed(6));
        if (!markerRef.current) {
          markerRef.current = L.marker([la, ln], { draggable: true }).addTo(map!);
          bindDrag(markerRef.current);
        } else {
          markerRef.current.setLatLng([la, ln]);
        }
        onChangeRef.current(la, ln);
      });

      const t = setTimeout(() => map?.invalidateSize(), 250);
      mapRef.current = map;
      return () => clearTimeout(t);
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markerRef.current = null;
      LRef.current = null;
    };
  }, [bindDrag]);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const la = Number(lat);
    const ln = Number(lng);
    if (!markerRef.current) {
      markerRef.current = L.marker([la, ln], { draggable: true }).addTo(map);
      bindDrag(markerRef.current);
    } else {
      const cur = markerRef.current.getLatLng();
      if (Math.abs(cur.lat - la) > 1e-7 || Math.abs(cur.lng - ln) > 1e-7) {
        markerRef.current.setLatLng([la, ln]);
      }
    }
    if (map.getZoom() < 14) map.setView([la, ln], 15);
  }, [lat, lng, bindDrag]);

  return (
    <div
      ref={holder}
      className="h-[220px] w-full overflow-hidden rounded-xl border border-line"
      aria-label="Property location picker"
    />
  );
}
