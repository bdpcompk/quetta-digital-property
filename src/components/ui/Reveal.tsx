"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.21, 0.65, 0.35, 1] },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.65, 0.35, 1] } },
};

/**
 * Safety net: IntersectionObserver can fail to fire for content mounted after
 * the initial page load (some webviews, automation, static-export CSR bailouts).
 * If the element is on screen but still hidden shortly after mount — or after
 * any scroll/resize — force the reveal so content can never stay invisible.
 */
function useRevealFallback(ref: RefObject<HTMLElement | null>) {
  const [force, setForce] = useState(false);

  useEffect(() => {
    let done = false;
    const check = () => {
      const el = ref.current;
      if (!el || done) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 40) {
        done = true;
        setForce(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    const t = setTimeout(check, 800);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ref]);

  return force;
}

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const force = useRevealFallback(ref);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={revealVariants}
      initial="hidden"
      animate={force ? "visible" : undefined}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const force = useRevealFallback(ref);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={force ? "visible" : undefined}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
