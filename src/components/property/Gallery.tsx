"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const move = (d: number) => setI((prev) => (prev + d + images.length) % images.length);

  return (
    <div>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-line">
        <AnimatePresence mode="wait">
          <motion.img
            key={i}
            src={images[i]}
            alt={`${alt} — photo ${i + 1}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        <button
          aria-label="Previous photo"
          onClick={() => move(-1)}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          aria-label="Next photo"
          onClick={() => move(1)}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>

        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-navy/85 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur">
          <Images size={13} /> {i + 1}/{images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto no-bar">
          {images.map((im, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                idx === i ? "border-green" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={im} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
