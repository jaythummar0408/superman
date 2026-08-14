"use client";

import React from "react";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

import { useFavorites } from "@/lib/use-favorites";
import { toolCategories } from "@/data/tools";
import { ToolCard, type Tool } from "@/components/ui/tool-card";

const ALL_TOOLS: Record<string, Tool> = Object.fromEntries(
  toolCategories.flatMap((c) => c.tools).map((t) => [t.href, t])
);

function Grid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((t) => (
        <ToolCard key={t.href} tool={t} />
      ))}
    </div>
  );
}

/**
 * `home`  → a "Your favorites" section that renders nothing when empty.
 * `page`  → the full favorites page with an empty state.
 */
export function Favorites({ variant }: { variant: "home" | "page" }) {
  const favorites = useFavorites();
  const tools = favorites.map((h) => ALL_TOOLS[h]).filter(Boolean);

  if (variant === "home") {
    if (tools.length === 0) return null;
    return (
      <section className="mb-4 rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-transparent p-5 dark:border-rose-900/30 dark:from-rose-950/20 lg:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
            <Heart className="h-4 w-4 fill-current" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Your favorites</h2>
            <p className="text-[13px] text-muted-foreground">Quick access to the tools you use most.</p>
          </div>
          <Link href="/favorites" className="ml-auto text-xs font-medium text-rose-500 hover:underline">
            View all →
          </Link>
        </div>
        <Grid tools={tools} />
      </section>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border/40 bg-white p-10 text-center shadow-sm dark:bg-card">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
          <Heart className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">No favorites yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap the <Heart className="inline h-3.5 w-3.5 -translate-y-px text-rose-500" /> heart on any tool to pin it
          here for quick access.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          Browse all tools
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {tools.length} favorite{tools.length > 1 ? "s" : ""}
      </p>
      <Grid tools={tools} />
    </div>
  );
}
