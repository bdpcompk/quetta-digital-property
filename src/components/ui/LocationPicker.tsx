"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Crosshair, Loader2, MapPin, Search } from "lucide-react";
import "leaflet/dist/leaflet.css";

const DEFAULT: [number, number] = [30.1575, 66.9905];

type Place = { name: string; lat: number; lng: number };

export default function LocationPicker({
  lat,
  lng,
  onChange,
  locationText,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  /** Address / district text — the pin follows it automatically when it changes. */
  locationText?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const initial = useRef({ lat, lng });
  const onChangeRef = useRef(onChange);
  const latInput = useRef<HTMLInputElement>(null);
  const lngInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [autoLocating, setAutoLocating] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const manualRef = useRef(0);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (latInput.current) latInput.current.value = lat == null ? "" : String(lat);
  }, [lat]);

  useEffect(() => {
    if (lngInput.current) lngInput.current.value = lng == null ? "" : String(lng);
  }, [lng]);

  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  const bindDrag = useCallback((marker: Leaflet.Marker) => {
    marker.off("dragend");
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      manualRef.current += 1;
      onChangeRef.current(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });
  }, []);

  const setPoint = (la: number, ln: number, zoom = 16, manual = true) => {
    const roundedLat = Number(la.toFixed(6));
    const roundedLng = Number(ln.toFixed(6));
    if (manual) manualRef.current += 1;
    const L = LRef.current;
    const map = mapRef.current;
    if (L && map) {
      if (!markerRef.current) {
        markerRef.current = L.marker([roundedLat, roundedLng], { draggable: true }).addTo(map);
        bindDrag(markerRef.current);
      } else {
        markerRef.current.setLatLng([roundedLat, roundedLng]);
      }
      map.setView([roundedLat, roundedLng], zoom);
    }
    if (latInput.current) latInput.current.value = String(roundedLat);
    if (lngInput.current) lngInput.current.value = String(roundedLng);
    onChangeRef.current(roundedLat, roundedLng);
  };

  const setPointRef = useRef(setPoint);
  useEffect(() => {
    setPointRef.current = setPoint;
  });

  const lastQuery = useRef((locationText ?? "").trim());

  // Move the pin automatically when the address / district changes.
  useEffect(() => {
    const q = (locationText ?? "").trim();
    if (q.length < 3 || q === lastQuery.current) return;
    const token = manualRef.current;
    const timer = setTimeout(async () => {
      setAutoLocating(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=0&limit=1&countrycodes=pk&accept-language=en&q=${encodeURIComponent(
            `${q}, Balochistan, Pakistan`
          )}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) return;
        const data: unknown = await res.json();
        const item = Array.isArray(data) ? (data[0] as { lat?: unknown; lon?: unknown } | undefined) : undefined;
        const la = Number(item?.lat);
        const ln = Number(item?.lon);
        if (!item || !Number.isFinite(la) || !Number.isFinite(ln)) return;
        if (manualRef.current !== token) return;
        lastQuery.current = q;
        setPointRef.current(la, ln, 14, false);
      } catch {
        /* keep the current pin when the lookup fails */
      } finally {
        setAutoLocating(false);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [locationText]);

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
      setPoint(la, ln);
    } else {
      if (latInput.current) latInput.current.value = lat == null ? "" : String(lat);
      if (lngInput.current) lngInput.current.value = lng == null ? "" : String(lng);
    }
  };

  const searchPlace = async () => {
    const q = query.trim();
    if (!q) {
      setSearchErr("Area ya landmark ka naam likhein.");
      return;
    }
    setSearching(true);
    setSearchErr("");
    setPlaces([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=0&limit=5&countrycodes=pk&accept-language=en&q=${encodeURIComponent(q)}`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error("Search failed");
      const data: unknown = await res.json();
      const items: Place[] = Array.isArray(data)
        ? data
            .map((d) => ({
              name: String((d as { display_name?: unknown }).display_name ?? ""),
              lat: Number((d as { lat?: unknown }).lat),
              lng: Number((d as { lon?: unknown }).lon),
            }))
            .filter((p) => p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng))
        : [];
      setPlaces(items);
      if (!items.length) setSearchErr("Koi jagah nahi mili — doosra naam try karein.");
    } catch {
      setSearchErr("Search nahi ho saka — internet check kar ke dobara try karein.");
    } finally {
      setSearching(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setSearchErr("Aap ka browser location support nahi karta.");
      return;
    }
    setLocating(true);
    setSearchErr("");
    setPlaces([]);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setPoint(pos.coords.latitude, pos.coords.longitude, 17);
      },
      () => {
        setLocating(false);
        setSearchErr("Location nahi mili — permission check karein.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

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
        manualRef.current += 1;
        if (!markerRef.current) {
          markerRef.current = L.marker([la, ln], { draggable: true }).addTo(map!);
          bindDrag(markerRef.current);
        } else {
          markerRef.current.setLatLng([la, ln]);
        }
        if (latInput.current) latInput.current.value = String(la);
        if (lngInput.current) lngInput.current.value = String(ln);
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
        if (map.getZoom() < 14) map.setView([la, ln], 15);
      }
    }
  }, [lat, lng, bindDrag]);

  return (
    <div>
      <div className="mb-2 flex items-stretch gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            className="field pl-9"
            placeholder="Search area or landmark…"
            value={query}
            aria-label="Search area or landmark"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchPlace();
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={searchPlace}
          disabled={searching}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-green px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-green-dark disabled:opacity-60"
        >
          {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Search
        </button>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-semibold text-navy transition-colors hover:bg-surface disabled:opacity-60"
        >
          {locating ? <Loader2 size={13} className="animate-spin" /> : <Crosshair size={13} />}
          Use my location
        </button>
        <span className="text-[11px] text-muted">
          {autoLocating ? (
            <span className="inline-flex items-center gap-1 font-semibold text-green">
              <Loader2 size={12} className="animate-spin" /> Address se pin lag raha hai…
            </span>
          ) : (
            "or tap the map"
          )}
        </span>
      </div>

      {searchErr && (
        <p className="mb-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11.5px] leading-snug text-red-600">
          {searchErr}
        </p>
      )}

      <div className="relative">
        <div
          ref={holder}
          className="h-[320px] w-full overflow-hidden rounded-xl border border-line sm:h-[380px]"
          aria-label="Property location picker"
        />
        {places.length > 0 && (
          <ul className="absolute inset-x-2 top-2 z-20 max-h-56 overflow-y-auto rounded-xl border border-line bg-white shadow-xl">
            {places.map((p, index) => (
              <li key={`${p.lat}-${p.lng}-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    setPoint(p.lat, p.lng);
                    setPlaces([]);
                    setQuery(p.name.split(",").slice(0, 2).join(","));
                  }}
                  className="flex w-full items-start gap-2 border-b border-line px-3 py-2.5 text-left last:border-0 hover:bg-surface"
                >
                  <MapPin size={14} className="mt-0.5 shrink-0 text-green" />
                  <span className="line-clamp-2 text-[12px] leading-snug text-navy">{p.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
        <p className="text-[11.5px] text-muted">
          Map par tap karein, search karein, ya coordinates type karein
        </p>
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
