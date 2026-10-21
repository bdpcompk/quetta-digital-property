const fs = require("fs");
const p = "C:/Users/ABDULW~1/AppData/Local/Temp/opencode/qdp-web/src/lib/i18n.ts";
const src = fs.readFileSync(p, "utf8");
const start = src.indexOf("export const URDU");
const end = src.indexOf("\n};", start);
const body = src.slice(start, end);
const re = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
let m;
const map = new Map();
let total = 0;
while ((m = re.exec(body))) {
  total++;
  const k = m[1];
  const v = m[2];
  if (!map.has(k)) map.set(k, []);
  map.get(k).push(v);
}
let dupes = 0, diffDupes = 0;
for (const [k, vs] of map) {
  if (vs.length > 1) {
    dupes++;
    const uniq = [...new Set(vs)];
    if (uniq.length > 1) {
      diffDupes++;
      console.log("DIFF-VALUE DUP:", k, "=>", JSON.stringify(vs));
    }
  }
}
console.log("TOTAL:", total, "| DUP KEYS:", dupes, "| DIFF-VALUE DUPES:", diffDupes);
