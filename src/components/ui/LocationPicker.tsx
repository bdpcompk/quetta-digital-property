"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Crosshair, Layers, Loader2, MapPin, Search } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { popularPlaces, searchLocalPlaces } from "@/lib/localPlaces";

const DEFAULT: [number, number] = [30.1575, 66.9905];

type Place = { name: string; lat: number; lng: number; local?: boolean; strong?: boolean };

async function fetchJson(url: string, ms = 6000): Promise<unknown | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchNominatim(q: string, limit = 5): Promise<Place[]> {
  const data = await fetchJson(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=0&limit=${limit}&countrycodes=pk&accept-language=en&q=${encodeURIComponent(q)}`
  );
  if (!Array.isArray(data)) return [];
  return data
    .map((d) => ({
      name: String((d as { display_name?: unknown }).display_name ?? ""),
      lat: Number((d as { lat?: unknown }).lat),
      lng: Number((d as { lon?: unknown }).lon),
    }))
    .filter((p) => p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng));
}

async function fetchPhoton(q: string, limit = 6): Promise<Place[]> {
  const data = await fetchJson(
    `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=${limit}&lang=en`
  );
  const features = (data as { features?: unknown[] })?.features;
  if (!Array.isArray(features)) return [];
  return features
    .map((f) => {
      const feature = f as {
        properties?: Record<string, unknown>;
        geometry?: { coordinates?: number[] };
      };
      const props = feature.properties ?? {};
      const coords = feature.geometry?.coordinates ?? [];
      const countryOk =
        String(props.countrycode ?? "").toUpperCase() === "PK" ||
        /pakistan/i.test(String(props.country ?? "")) ||
        String(props.state ?? "") === "Balochistan";
      const name = [props.name, props.city ?? props.district, props.state]
        .filter((v) => typeof v === "string" && v)
        .join(", ");
      return {
        name,
        lat: Number(coords[1]),
        lng: Number(coords[0]),
        countryOk,
      };
    })
    .filter((p) => p.countryOk && p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng))
    .map(({ name, lat, lng }) => ({ name, lat, lng }));
}

const GENERIC_WORDS = new Set([
  "quetta", "balochistan", "baluchistan", "pakistan", "road", "street", "town",
  "colony", "housing", "scheme", "society", "city", "area", "near", "main",
  "block", "sector", "phase", "new", "the", "and",
]);

const loose = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** How many meaningful words of the query appear in the Esri result name. */
function esriRelevance(query: string, name: string): number {
  const wanted = loose(query)
    .split(" ")
    .filter((w) => w.length > 2 && !GENERIC_WORDS.has(w));
  if (!wanted.length) return 1;
  const have = loose(name).split(" ");
  let hits = 0;
  for (const w of wanted) {
    if (
      have.some(
        (h) => h === w || (h.length >= 4 && w.length >= 4 && h.slice(0, 3) === w.slice(0, 3))
      )
    ) {
      hits += 1;
    }
  }
  return hits;
}

/**
 * Esri World Geocoder — keyless, CORS-enabled, and much better than OSM for
 * Pakistani localities (Haji Camp, Model Town, Kharotabad, Killi Ismail...).
 * `location` + `distance` sort Balochistan matches first so same-named places
 * in other provinces do not steal the top spot.
 */
async function fetchEsri(q: string, limit = 6): Promise<Place[]> {
  const data = await fetchJson(
    `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(
      q
    )}&maxLocations=${limit + 4}&countryCode=PAK&outFields=Match_addr,Addr_type&location=66.99,30.18&distance=80000`
  );
  const candidates = (data as { candidates?: unknown[] })?.candidates;
  if (!Array.isArray(candidates)) return [];
  return candidates
    .map((c) => {
      const cand = c as {
        address?: unknown;
        score?: unknown;
        location?: { x?: unknown; y?: unknown };
      };
      return {
        name: String(cand.address ?? ""),
        lat: Number(cand.location?.y),
        lng: Number(cand.location?.x),
        score: Number(cand.score ?? 0),
      };
    })
    .filter(
      (p) =>
        p.name &&
        Number.isFinite(p.lat) &&
        Number.isFinite(p.lng) &&
        // Pakistan bounding box.
        p.lat > 23 &&
        p.lat < 38 &&
        p.lng > 60 &&
        p.lng < 78
    )
    .map((p) => ({ ...p, relevance: esriRelevance(q, p.name) }))
    .filter((p) => p.score >= 65 && p.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance || b.score - a.score)
    .slice(0, limit)
    .map(({ name, lat, lng, score }) => ({ name, lat, lng, strong: score >= 90 }));
}

function dedupePlaces(items: Place[]): Place[] {
  const out: Place[] = [];
  for (const item of items) {
    const near = out.some(
      (o) => Math.abs(o.lat - item.lat) < 0.0015 && Math.abs(o.lng - item.lng) < 0.0015
    );
    if (!near) out.push(item);
  }
  return out;
}

/** How much of the typed text appears in a result name (0–1). */
function nameScore(query: string, name: string): number {
  const wanted = loose(query)
    .split(" ")
    .filter((w) => (w.length > 1 || /^\d+$/.test(w)) && !GENERIC_WORDS.has(w));
  if (!wanted.length) return 0;
  const hay = loose(name);
  const hits = wanted.filter((w) => hay.includes(w)).length;
  return hits / wanted.length;
}

function localPlacesFor(q: string): Place[] {
  return searchLocalPlaces(q).map((p) => ({
    name: `${p.name}, ${p.district}`,
    lat: p.lat,
    lng: p.lng,
    local: true,
  }));
}

/** Local matches stay on top; remote matches are ordered by how well they fit. */
function orderPlaces(query: string, items: Place[]): Place[] {
  return [...items].sort((a, b) => {
    if (a.local !== b.local) return a.local ? -1 : 1;
    if (a.local && b.local) return 0;
    return nameScore(query, b.name) - nameScore(query, a.name);
  });
}

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
  const searchSeq = useRef(0);

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
  const baseLayers = useRef<{ street?: Leaflet.TileLayer; satellite?: Leaflet.TileLayer }>({});
  const [basemap, setBasemap] = useState<"street" | "satellite">("satellite");

  const switchBasemap = (next: "street" | "satellite") => {
    setBasemap(next);
    const map = mapRef.current;
    const layers = baseLayers.current;
    if (!map || !layers.street || !layers.satellite) return;
    const active = next === "satellite" ? layers.satellite : layers.street;
    const inactive = next === "satellite" ? layers.street : layers.satellite;
    if (map.hasLayer(inactive)) map.removeLayer(inactive);
    if (!map.hasLayer(active)) active.addTo(map);
  };

  const bindDrag = useCallback((marker: Leaflet.Marker) => {
    marker.off("dragend");
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      manualRef.current += 1;
      searchSeq.current += 1;
      onChangeRef.current(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });
  }, []);

  const setPoint = (la: number, ln: number, zoom = 16, manual = true) => {
    const roundedLat = Number(la.toFixed(6));
    const roundedLng = Number(ln.toFixed(6));
    if (manual) {
      manualRef.current += 1;
      searchSeq.current += 1;
    }
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
        // Local Quetta / Balochistan gazetteer first — instant and accurate for
        // localities that public geocoders do not index.
        const local = searchLocalPlaces(q, 1)[0];
        if (local) {
          if (manualRef.current !== token) return;
          lastQuery.current = q;
          setPointRef.current(local.lat, local.lng, 14, false);
          return;
        }

        const remoteQuery = /pakistan/i.test(q) ? q : `${q}, Pakistan`;
        const esriPromise = fetchEsri(remoteQuery, 1);
        const nomPromise = fetchNominatim(remoteQuery, 1);
        const phoPromise = fetchPhoton(remoteQuery, 1);
        let first = (await esriPromise)[0];
        if (!first) {
          const [nom, pho] = await Promise.allSettled([nomPromise, phoPromise]);
          first = [
            ...(nom.status === "fulfilled" ? nom.value : []),
            ...(pho.status === "fulfilled" ? pho.value : []),
          ][0];
        }
        if (!first) return;
        if (manualRef.current !== token) return;
        lastQuery.current = q;
        setPointRef.current(first.lat, first.lng, 14, false);
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
    const seq = ++searchSeq.current;
    setSearching(true);
    setSearchErr("");
    setPlaces([]);

    const local: Place[] = localPlacesFor(q);

    // Local Quetta / Balochistan matches are instant — no waiting on the network.
    if (local.length === 1) {
      setSearching(false);
      setQuery(local[0].name.split(",").slice(0, 2).join(","));
      setPoint(local[0].lat, local[0].lng, 16);
      return;
    }
    if (local.length > 1) {
      setPlaces(local);
    }

    // Results are shown in a stable source order (local → Esri → Nominatim →
    // Photon), but each source paints as soon as it answers so one slow
    // geocoder never blocks the others.
    const buckets: Place[][] = [local, [], [], []];
    const add = (slot: number) => (items: Place[]) => {
      if (!items.length || seq !== searchSeq.current) return;
      buckets[slot] = items;
      const merged = dedupePlaces(orderPlaces(q, buckets.flat())).slice(0, 8);
      setPlaces(merged);
      setSearching(false);

      // One confident match: drop the pin straight away, without waiting for
      // the remaining (possibly slow) geocoders.
      if (merged.length === 1 && merged[0].strong) {
        searchSeq.current += 1;
        setQuery(merged[0].name.split(",").slice(0, 2).join(","));
        setPoint(merged[0].lat, merged[0].lng, 16);
      }
    };

    await Promise.allSettled([
      fetchEsri(q).then(add(1)),
      fetchNominatim(q).then(add(2)),
      fetchPhoton(q).then(add(3)),
    ]);

    if (seq !== searchSeq.current) return;
    setSearching(false);

    const merged = dedupePlaces(orderPlaces(q, buckets.flat())).slice(0, 8);

    if (!merged.length) {
      setSearchErr(
        "Is naam se jagah nahi mili — qareeb ka landmark likhein ya neeche map par tap kar ke pin lagayen."
      );
      return;
    }

    // A single clear match: drop the pin straight away so the search feels instant.
    if (merged.length === 1) {
      setQuery(merged[0].name.split(",").slice(0, 2).join(","));
      setPoint(merged[0].lat, merged[0].lng, 16);
      return;
    }

    setPlaces(merged);
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

      map = L.map(el, { scrollWheelZoom: false, maxZoom: 18, minZoom: 4 }).setView(start, zoom);
      const street = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
        maxNativeZoom: 18,
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
      });
      const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
        maxNativeZoom: 18,
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
      });
      satellite.addTo(map);
      baseLayers.current = { street, satellite };

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
        searchSeq.current += 1;
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

  const quickPlaces = popularPlaces(locationText);

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
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              setSearchErr("");
              // Typing cancels any running remote search and shows local
              // suggestions immediately, so the map feels connected.
              searchSeq.current += 1;
              setSearching(false);
              setPlaces(value.trim().length >= 2 ? localPlacesFor(value) : []);
            }}
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

      {quickPlaces.length > 0 && (
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto no-bar">
          <span className="shrink-0 text-[11px] text-muted">Popular:</span>
          {quickPlaces.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setPoint(p.lat, p.lng, 15);
                setQuery(p.name);
                setPlaces([]);
                setSearchErr("");
              }}
              className="shrink-0 rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] font-semibold text-navy transition-colors hover:border-green hover:text-green"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

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
        <div className="inline-flex items-center gap-1 rounded-lg border border-line bg-white p-0.5">
          <button
            type="button"
            onClick={() => switchBasemap("satellite")}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-semibold transition-colors ${
              basemap === "satellite" ? "bg-green text-white" : "text-navy hover:bg-surface"
            }`}
          >
            <Layers size={12} /> Satellite
          </button>
          <button
            type="button"
            onClick={() => switchBasemap("street")}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-semibold transition-colors ${
              basemap === "street" ? "bg-green text-white" : "text-navy hover:bg-surface"
            }`}
          >
            <Layers size={12} /> Street
          </button>
        </div>
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
