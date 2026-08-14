"use client";

import React from "react";
import { Search, Sparkles, Zap, ShieldCheck, CloudOff } from "lucide-react";

import { toolCategories } from "@/data/tools";

const ALL = toolCategories.flatMap((c) => c.tools);
const LIVE = ALL.filter((t) => t.available).length;
const TOTAL_LABEL = `${Math.floor(LIVE / 10) * 10}+`;

const STATS = [
  { icon: Sparkles, label: `${TOTAL_LABEL} tools` },
  { icon: Zap, label: "Instant & free" },
  { icon: ShieldCheck, label: "Privacy-first" },
  { icon: CloudOff, label: "Works offline" },
];

function openSearch() {
  window.dispatchEvent(new CustomEvent("notch:open-search"));
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-cyan-500/10 blur-3xl dark:from-primary/25 dark:via-fuchsia-500/15 dark:to-cyan-500/15" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur dark:bg-card/60">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {LIVE} free tools · no sign-up
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Every tool you need,
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              in one place
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            A polished collection of developer &amp; design tools — convert, generate, format and calculate,
            all running privately in your browser.
          </p>

          {/* Search launcher */}
          <button
            onClick={openSearch}
            className="group mx-auto mt-8 flex w-full max-w-lg items-center gap-3 rounded-xl border border-border/70 bg-white px-4 py-3.5 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md dark:bg-card"
            aria-label="Search tools"
          >
            <Search className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="flex-1 text-sm text-muted-foreground">Search {LIVE}+ tools…</span>
            <kbd className="hidden items-center gap-0.5 rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground sm:inline-flex">
              ⌘K
            </kbd>
          </button>

          {/* Stat chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {STATS.map((s) => (
              <span key={s.label} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <s.icon className="h-3.5 w-3.5 text-primary/70" />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
