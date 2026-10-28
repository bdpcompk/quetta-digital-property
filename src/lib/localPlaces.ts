export type LocalPlace = {
  name: string;
  district: string;
  lat: number;
  lng: number;
  /** Alternate spellings, e.g. "Nosar" for Nohsar. */
  aliases?: string[];
};

/**
 * Offline gazetteer for Quetta localities and Balochistan district centres.
 * Coordinates come from OpenStreetMap / district reference points.
 * Keeping this local makes search instant and reliable for local names that
 * public geocoders (Nominatim / Photon) often miss.
 */
export const LOCAL_PLACES: LocalPlace[] = [
  // ---- Quetta city & suburbs ----
  { name: "Nawa Killi", district: "Quetta", lat: 30.22375, lng: 67.00836, aliases: ["nawa kali", "nawan killi", "nawa kili"] },
  { name: "Wapda Colony", district: "Quetta", lat: 30.25443, lng: 67.02528, aliases: ["wadpa colony", "wapda town"] },
  { name: "Nohsar", district: "Quetta", lat: 30.24204, lng: 66.89177, aliases: ["nosar", "nau hisar", "nohsar road", "aghbarg", "regi nasaran"] },
  { name: "Jinnah Town", district: "Quetta", lat: 30.21774, lng: 66.98945 },
  { name: "Satellite Town", district: "Quetta", lat: 30.16624, lng: 67.00152 },
  { name: "Quetta Cantt", district: "Quetta", lat: 30.22670, lng: 67.04562, aliases: ["cantt", "cantonment"] },
  { name: "Zarghoon Road", district: "Quetta", lat: 30.18028, lng: 66.99882, aliases: ["zarghun road"] },
  { name: "Samungli Road", district: "Quetta", lat: 30.20728, lng: 67.00989, aliases: ["samungli"] },
  { name: "Airport Road", district: "Quetta", lat: 30.21747, lng: 67.01355 },
  { name: "Prince Road", district: "Quetta", lat: 30.19435, lng: 67.00360 },
  { name: "Sariab Road", district: "Quetta", lat: 30.16995, lng: 66.99458, aliases: ["saryab", "sariab"] },
  { name: "Brewery Road", district: "Quetta", lat: 30.19028, lng: 66.96489 },
  { name: "Kharotabad", district: "Quetta", lat: 30.21462, lng: 66.97175, aliases: ["kharot abad"] },
  { name: "Hazara Town", district: "Quetta", lat: 30.17910, lng: 66.95479, aliases: ["hazara town road"] },
  { name: "Killi Ismail", district: "Quetta", lat: 30.21522, lng: 66.99872 },
  { name: "Pashtoonabad", district: "Quetta", lat: 30.16978, lng: 67.01225, aliases: ["pashtun abad"] },
  { name: "Kuchlak", district: "Quetta", lat: 30.36282, lng: 66.94968 },
  { name: "Sariab Mills Colony", district: "Quetta", lat: 30.10670, lng: 66.97936 },
  { name: "Hazargangi", district: "Quetta", lat: 30.09431, lng: 66.93622 },
  { name: "Killi Kamaloo", district: "Quetta", lat: 30.10404, lng: 66.97197, aliases: ["kamaloo"] },
  { name: "Faizabad Sariab", district: "Quetta", lat: 30.12644, lng: 66.97760 },
  { name: "Kechi Baig", district: "Quetta", lat: 30.13467, lng: 66.97752 },
  { name: "Shaldra", district: "Quetta", lat: 30.17869, lng: 67.01946 },
  { name: "Rehmat Colony", district: "Quetta", lat: 30.17645, lng: 67.00927 },
  { name: "Ismail Colony", district: "Quetta", lat: 30.17804, lng: 67.01073 },
  { name: "Jan Muhammad Road", district: "Quetta", lat: 30.18520, lng: 67.00495 },
  { name: "Arbab Town", district: "Quetta", lat: 30.21752, lng: 66.98270 },
  { name: "Chakki Shahwani", district: "Quetta", lat: 30.15015, lng: 66.98363 },
  { name: "Hudda", district: "Quetta", lat: 30.20941, lng: 66.99721 },
  { name: "Isa Nagri", district: "Quetta", lat: 30.18797, lng: 66.97792 },
  { name: "Killi Shaboo", district: "Quetta", lat: 30.22998, lng: 66.99344 },
  { name: "Killi Kutwal", district: "Quetta", lat: 30.23771, lng: 67.00287 },
  { name: "Khiljiabad", district: "Quetta", lat: 30.24327, lng: 67.01058 },
  { name: "Labour Colony", district: "Quetta", lat: 30.24578, lng: 67.02485 },
  { name: "Darakshan Housing Scheme", district: "Quetta", lat: 30.05552, lng: 66.98340 },
  { name: "Quetta City", district: "Quetta", lat: 30.19152, lng: 67.01529 },

  // ---- Balochistan district centres ----
  { name: "Quetta", district: "Quetta", lat: 30.1575, lng: 66.9905 },
  { name: "Gwadar", district: "Gwadar", lat: 25.1268, lng: 62.3467 },
  { name: "Turbat", district: "Kech", lat: 26.0012, lng: 63.083 },
  { name: "Khuzdar", district: "Khuzdar", lat: 27.812, lng: 66.6686 },
  { name: "Chaman", district: "Chaman", lat: 31.1807, lng: 66.201 },
  { name: "Panjgur", district: "Panjgur", lat: 26.972, lng: 64.116 },
  { name: "Lasbela", district: "Lasbela", lat: 25.846, lng: 66.617 },
  { name: "Sibi", district: "Sibi", lat: 29.4749, lng: 67.849 },
  { name: "Zhob", district: "Zhob", lat: 31.34, lng: 69.448 },
  { name: "Pishin", district: "Pishin", lat: 30.5333, lng: 66.975 },
  { name: "Mastung", district: "Mastung", lat: 29.735, lng: 66.85 },
  { name: "Kalat", district: "Kalat", lat: 29.094, lng: 67.212 },
  { name: "Loralai", district: "Loralai", lat: 30.37, lng: 68.55 },
  { name: "Barkhan", district: "Barkhan", lat: 29.88, lng: 69.65 },
  { name: "Kohlu", district: "Kohlu", lat: 29.84, lng: 69.25 },
  { name: "Dera Bugti", district: "Dera Bugti", lat: 29.03, lng: 69.17 },
  { name: "Nushki", district: "Nushki", lat: 29.55, lng: 66.02 },
  { name: "Chagai", district: "Chagai", lat: 29.3, lng: 64.85 },
  { name: "Washuk", district: "Washuk", lat: 28.4, lng: 64.2 },
  { name: "Awaran", district: "Awaran", lat: 28.9, lng: 65.4 },
  { name: "Kharan", district: "Kharan", lat: 28.58, lng: 65.42 },
  { name: "Harnai", district: "Harnai", lat: 30.1, lng: 68.35 },
  { name: "Musakhel", district: "Musakhel", lat: 30.35, lng: 68.7 },
  { name: "Killa Saifullah", district: "Killa Saifullah", lat: 30.7, lng: 69.35 },
  { name: "Killa Abdullah", district: "Killa Abdullah", lat: 31.12, lng: 67.15 },
  { name: "Jhal Magsi", district: "Jhal Magsi", lat: 28.6, lng: 67.75 },
  { name: "Sherani", district: "Sherani", lat: 30.5, lng: 69.85 },
  { name: "Duki", district: "Duki", lat: 30.15, lng: 68.55 },
];

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SKIP_WORDS = new Set(["pakistan", "balochistan"]);

function scorePlace(q: string, place: LocalPlace): number {
  const name = normalise(place.name);
  const aliases = (place.aliases ?? []).map(normalise);
  const names = [name, ...aliases];
  let best = 0;

  const qWords = q.split(" ").filter((w) => w.length > 1 && !SKIP_WORDS.has(w));
  if (!qWords.length) return 0;

  for (const n of names) {
    if (q === n) return 200;
    if (q.includes(n)) {
      // Full place name appears in the query: strong match. Later mentions in an
      // address are usually the more specific locality, so add a small bonus.
      const at = q.lastIndexOf(n);
      best = Math.max(best, 100 + (at / Math.max(q.length, 1)) * 20);
    }
    if (n.includes(q) && q.length >= 4) {
      // Typed a part of the name, e.g. "Sariab" → "Sariab Road".
      best = Math.max(best, 95);
    }
    const nWords = n.split(" ").filter((w) => w.length > 2);
    if (!nWords.length) continue;
    const matched = nWords.filter((w) => q.includes(w)).length;
    if (matched === nWords.length) {
      best = Math.max(best, 70 + nWords.length * 8);
    } else if (matched > 0) {
      best = Math.max(best, 25 + matched * 10);
    }
  }
  return best;
}

/** Find Quetta / Balochistan places matching the typed text. */
export function searchLocalPlaces(query: string, limit = 6): LocalPlace[] {
  const q = normalise(query);
  if (!q) return [];
  const qWords = q.split(" ").filter((w) => w.length > 1 && !SKIP_WORDS.has(w));
  return LOCAL_PLACES.map((place) => {
    let score = scorePlace(q, place);
    // When the query has other words, a one-word generic city name (e.g.
    // "Quetta" inside "Nawa Killi, Quetta") should not crowd out the locality.
    if (qWords.length > 1 && !place.name.includes(" ") && q !== normalise(place.name)) {
      score *= 0.6;
    }
    return { place, score };
  })
    .filter((item) => item.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.place);
}

/** Popular chips to show above the map for a given district text. */
export function popularPlaces(districtText?: string, limit = 6): LocalPlace[] {
  const hint = normalise(districtText ?? "quetta");
  const inQuetta = !hint || hint.includes("quetta");
  const names = inQuetta
    ? ["Nawa Killi", "Wapda Colony", "Nohsar", "Sariab Road", "Jinnah Town", "Airport Road"]
    : [];
  return names
    .map((name) => LOCAL_PLACES.find((p) => p.name === name))
    .filter((p): p is LocalPlace => Boolean(p))
    .slice(0, limit);
}
