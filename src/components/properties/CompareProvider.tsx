"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Scale } from "lucide-react";
import Link from "next/link";
import type { Property } from "@/lib/types";

type CompareCtx = {
  items: Property[];
  add: (p: Property) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const Ctx = createContext<CompareCtx>({ items: [], add: () => {}, remove: () => {}, clear: () => {} });

export function useCompare() {
  return useContext(Ctx);
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Property[]>([]);

  const add = (p: Property) => {
    setItems((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });
  };

  const remove = (id: number) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clear = () => setItems([]);

  return (
    <Ctx.Provider value={{ items, add, remove, clear }}>
      {children}
      {items.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-xl -translate-x-1/2 rounded-2xl border border-line bg-white p-3 shadow-[0_12px_40px_rgba(13,31,51,.25)]">
          <div className="flex items-center gap-3">
            <Scale size={18} className="shrink-0 text-green" />
            <span className="text-[13px] font-semibold text-ink">{items.length} selected</span>
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-hidden">
              {items.map((p) => (
                <button
                  key={p.id}
                  onClick={() => remove(p.id)}
                  title="Remove"
                  className="shrink-0 truncate rounded-lg bg-surface px-2 py-1 text-[11.5px] text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  {p.title.slice(0, 20)}… ✕
                </button>
              ))}
            </div>
            <Link
              href={`/compare/?ids=${items.map((i) => i.id).join(",")}`}
              className="btn-primary shrink-0 px-3 py-1.5 text-[12.5px]"
            >
              Compare →
            </Link>
            <button onClick={clear} className="shrink-0 text-[12px] text-muted hover:text-ink">
              Clear
            </button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
