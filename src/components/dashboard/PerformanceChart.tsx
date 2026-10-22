"use client";

const W = 640;
const H = 240;
const PAD_L = 34;
const PAD_R = 10;
const PAD_T = 12;
const PAD_B = 26;

function xAt(i: number, n: number) {
  if (n <= 1) return PAD_L;
  return PAD_L + (i * (W - PAD_L - PAD_R)) / (n - 1);
}

function yAt(v: number, max: number) {
  const inner = H - PAD_T - PAD_B;
  return PAD_T + (1 - (max <= 0 ? 0 : v / max)) * inner;
}

function linePath(vals: number[], max: number) {
  return vals
    .map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i, vals.length).toFixed(1)},${yAt(v, max).toFixed(1)}`)
    .join(" ");
}

function areaPath(vals: number[], max: number) {
  if (!vals.length) return "";
  const bottom = H - PAD_B;
  const last = xAt(vals.length - 1, vals.length).toFixed(1);
  return `${linePath(vals, max)} L${last},${bottom} L${PAD_L},${bottom} Z`;
}

export default function PerformanceChart({
  views,
  inquiries,
  labels,
}: {
  views: number[];
  inquiries: number[];
  labels: string[];
}) {
  const max = Math.max(4, ...views, ...inquiries);
  const niceMax = Math.max(4, Math.ceil(max / 4) * 4);
  const grid = [0, 0.25, 0.5, 0.75, 1];
  const tickIdx = [0, 7, 14, 21, 29].filter((i) => i < labels.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Listing performance chart">
      <defs>
        <linearGradient id="bdpViewsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      {grid.map((g) => {
        const value = niceMax * (1 - g);
        const y = yAt(value, niceMax);
        return (
          <g key={g}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 3.5} textAnchor="end" fontSize="9.5" fill="#9ca3af">
              {Math.round(value)}
            </text>
          </g>
        );
      })}

      {tickIdx.map((i) => (
        <text
          key={i}
          x={xAt(i, labels.length)}
          y={H - 8}
          textAnchor="middle"
          fontSize="9.5"
          fill="#9ca3af"
        >
          {labels[i] ?? ""}
        </text>
      ))}

      <path d={areaPath(views, niceMax)} fill="url(#bdpViewsFill)" />
      <path d={linePath(views, niceMax)} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
      <path d={linePath(inquiries, niceMax)} fill="none" stroke="#1a8754" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
