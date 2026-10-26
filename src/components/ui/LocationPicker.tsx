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
  const latInput = useRef<HTMLInputElement>(null);
  const lngInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (latInput.current) latInput.current.value = lat == null ? "" : String(lat);
  }, [lat]);

  useEffect(() => {
    if (lngInput.current) lngInput.current.value = lng == null ? "" : String(lng);
  }, [lng]);

  const applyCoords = () => {
    const latRaw = latInput.current?.value.trim() ?? "";
    const lngRaw = lngInput.current?.value.trim() ?? "";
    const la = Number(latRaw);
    const ln = Number(lngRaw);
    const valid =
      latRaw !== "" &&
      lngRaw !== "" &&
      Number.isFinite(la) &&
      Number.isFinite(ln) &&
      Math.abs(la) <= 90 &&
      Math.abs(ln) <= 180;
    if (valid) {
      onChange(la, ln);
    } else {
      if (latInput.current) latInput.current.value = lat == null ? "" : String(lat);
      if (lngInput.current) lngInput.current.value = lng == null ? "" : String(lng);
    }
  };

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
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
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
    <div>
      <div
        ref={holder}
        className="h-[300px] w-full overflow-hidden rounded-xl border border-line sm:h-[340px]"
        aria-label="Property location picker"
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <label className="field-label text-[11.5px]">Latitude</label>
          <input
            ref={latInput}
            className="field"
            inputMode="decimal"
            placeholder="30.185700"
            defaultValue={lat == null ? "" : String(lat)}
            onBlur={applyCoords}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyCoords();
              }
            }}
          />
        </div>
        <div>
          <label className="field-label text-[11.5px]">Longitude</label>
          <input
            ref={lngInput}
            className="field"
            inputMode="decimal"
            placeholder="66.992600"
            defaultValue={lng == null ? "" : String(lng)}
            onBlur={applyCoords}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyCoords();
              }
            }}
          />
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="text-[11.5px] text-muted">Map par click karein ya coordinates type karein</p>
        <button
          type="button"
          onClick={applyCoords}
          className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-[11.5px] font-semibold text-navy transition-colors hover:bg-surface"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
