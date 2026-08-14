"use client";

import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type State = "idle" | "hidden" | "shown";

/**
 * Fades + slides its children into view as they scroll near the viewport — but
 * only as a progressive enhancement. The default state is fully visible, so the
 * server-rendered content is never hidden if JavaScript is slow, fails, or is
 * disabled (which previously left cards blank on mobile). Only elements that
 * start *below the fold* are hidden and then revealed on scroll, so there is no
 * visible flash for content already on screen.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return; // stay visible

    // Anything already in (or above) the viewport stays visible — no animation,
    // no flash. Only off-screen content gets the reveal treatment.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);

    // Safety net — never leave content hidden.
    const fallback = setTimeout(() => setState("shown"), 1200);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: state === "shown" ? `${delay}ms` : "0ms" }}
      className={cn(
        state !== "idle" && "transition-all duration-700 ease-out motion-reduce:transition-none",
        state === "hidden" ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}
