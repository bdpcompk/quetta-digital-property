"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

export default function Gallery({
  images,
  alt,
  onOpen,
}: {
  images: string[];
  alt: string;
  onOpen?: () => void;
}) {
  const [i, setI] = useState(0);
  const move = (d: number) => setI((prev) => (prev + d + images.length) % images.length);
  const idx = images.length ? Math.min(i, images.length - 1) : 0;

  return (
    <div>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-line">
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={images[idx]}
            alt={`${alt} — photo ${idx + 1}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open all ${images.length} photos and videos`}
            className="absolute inset-0 z-10 cursor-zoom-in"
          />
        )}

        {images.length > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              aria-label="Next photo"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {onOpen && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[12px] font-bold text-navy shadow backdrop-blur">
            <Images size={13} className="text-green" /> View all {images.length} photos
          </span>
        )}

        <span className="pointer-events-none absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-lg bg-navy/85 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur">
          <Images size={13} /> {idx + 1}/{images.length}
        </span>
      </div>
    </div>
  );
}
