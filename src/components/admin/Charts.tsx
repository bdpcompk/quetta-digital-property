export type Seg = { label: string; value: number; color: string };

export function Donut({ segs, total }: { segs: Seg[]; total: number }) {
  const r = 58;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label="Property overview chart">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#eef1f6" strokeWidth="24" />
        {total > 0 &&
          segs
            .filter((s) => s.value > 0)
            .map((s) => {
              const len = (s.value / total) * C;
              const el = (
                <circle
                  key={s.label}
                  cx="80"
                  cy="80"
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="24"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-acc}
                  transform="rotate(-90 80 80)"
                />
              );
              acc += len;
              return el;
            })}
        <text x="80" y="76" textAnchor="middle" fontSize="27" fontWeight="800" className="fill-navy">
          {total}
        </text>
        <text x="80" y="97" textAnchor="middle" fontSize="11" className="fill-muted">
          Total
        </text>
      </svg>
      <ul className="min-w-[150px] flex-1 space-y-2.5">
        {segs.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-[13px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="font-medium text-ink">{s.label}</span>
            <span className="ml-auto text-muted">
              {s.value} ({Math.round((s.value / (total || 1)) * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const W = 640;
  const H = 230;
  const PL = 36;
  const PR = 10;
  const PT = 14;
  const PB = 30;
  const max = Math.max(4, ...data.map((d) => d.value));
  if (data.length === 0) return null;
  const x = (i: number) => PL + (i / Math.max(1, data.length - 1)) * (W - PL - PR);
  const y = (v: number) => PT + (1 - v / max) * (H - PT - PB);
  const pts = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`);
  const line = pts.join(" ");
  const area = `M${pts[0]} L${line.split(" ").join(" L")} L${x(data.length - 1).toFixed(1)},${H - PB} L${x(0).toFixed(1)},${H - PB} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const labelEvery = Math.ceil(data.length / 6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full" role="img" aria-label="Inquiries trend chart">
      <defs>
        <linearGradient id="inqFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {ticks.map((t) => {
        const v = Math.round(max * (1 - t));
        const yy = PT + t * (H - PT - PB);
        return (
          <g key={t}>
            <line x1={PL} y1={yy} x2={W - PR} y2={yy} stroke="#eef1f6" strokeWidth="1" />
            <text x={PL - 8} y={yy + 4} textAnchor="end" fontSize="10" className="fill-muted">
              {v}
            </text>
          </g>
        );
      })}
      <path d={area} fill="url(#inqFill)" />
      <polyline points={line} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) =>
        d.value > 0 ? <circle key={i} cx={x(i)} cy={y(d.value)} r="3" fill="#2563eb" stroke="#fff" strokeWidth="1.5" /> : null
      )}
      {data.map((d, i) =>
        i % labelEvery === 0 || i === data.length - 1 ? (
          <text key={`l${i}`} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" className="fill-muted">
            {d.label}
          </text>
        ) : null
      )}
    </svg>
  );
}
