const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_KEY || "";
const MODEL = "qwen/qwen3.8-27b";
const CACHE_KEY = "bdp-ai-urdu";
const BATCH_SIZE = 20;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callGroq(numbered: string): Promise<string | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(2000 * attempt);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a professional English-to-Urdu translator for a Pakistani real-estate website (Balochistan property portal). Translate each numbered line to natural, formal Urdu suitable for a property website UI. Keep numbers, prices (PKR, Lakh, Crore), area units (Marla, Kanal, Square Feet), brand names (bdp.com.pk, QDA, BDA), phone numbers, emails, URLs UNCHANGED. Reply with ONLY the numbered translations, one per line. No explanations.",
            },
            { role: "user", content: numbered },
          ],
          temperature: 0.2,
          max_tokens: 1024,
        }),
      });
      if (res.status === 429) continue;
      if (!res.ok) return null;
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    } catch {
      continue;
    }
  }
  return null;
}

export function loadAiCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAiCache(dict: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(dict));
  } catch {}
}

export function collectVisibleText(): string[] {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TITLE"].includes(tag)) return NodeFilter.FILTER_REJECT;
      const text = node.textContent?.trim() || "";
      if (text.length < 3 || text.length > 180) return NodeFilter.FILTER_REJECT;
      if (/[\u0600-\u06FF]/.test(text)) return NodeFilter.FILTER_REJECT;
      if (!/[a-zA-Z]/.test(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const set = new Set<string>();
  let node: Node | null;
  while ((node = walker.nextNode())) {
    set.add((node.textContent || "").trim());
  }
  return [...set];
}

export async function batchTranslate(texts: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const numbered = batch.map((t, j) => `${j + 1}. ${t}`).join("\n");
    const content = await callGroq(numbered);
    if (!content) continue;

    const lines = content.split("\n").filter((l) => /^\s*\d+\./.test(l));
    lines.forEach((line, j) => {
      const ur = line.replace(/^\s*\d+\.\s*/, "").trim();
      if (ur && batch[j]) result[batch[j]] = ur;
    });

    if (i + BATCH_SIZE < texts.length) await sleep(1500);
  }

  return result;
}
