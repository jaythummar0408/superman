"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getImageDimensions } from "@/lib/image-utils";

export interface LoadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

/**
 * Manages a single uploaded image and its object URL lifecycle.
 * Revokes the previous URL on replace and the current one on unmount.
 */
export function useImageFile() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    urlRef.current = image?.url ?? null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const select = useCallback(async (files: File[]): Promise<LoadedImage | null> => {
    const file = files[0];
    if (!file) return null;
    const url = URL.createObjectURL(file);
    let dims = { width: 0, height: 0 };
    try {
      dims = await getImageDimensions(file);
    } catch {
      /* dimensions are best-effort */
    }
    const next: LoadedImage = { file, url, width: dims.width, height: dims.height };
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return next;
    });
    return next;
  }, []);

  const clear = useCallback(() => {
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  return { image, select, clear };
}
