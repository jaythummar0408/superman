"use client";

import { useSyncExternalStore } from "react";

const KEY = "notch:favorites";
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return Array.isArray(parsed) ? (parsed as string[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): string[] {
  if (cache === null) cache = read();
  return cache;
}

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// Keep favorites in sync across tabs.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cache = read();
      notify();
    }
  });
}

export function toggleFavorite(href: string): void {
  const current = getSnapshot();
  const next = current.includes(href) ? current.filter((h) => h !== href) : [href, ...current];
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable (private mode) */
  }
  notify();
}

/** Reactive list of favorited tool hrefs. SSR-safe (empty on the server). */
export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function useIsFavorite(href: string): boolean {
  return useFavorites().includes(href);
}
