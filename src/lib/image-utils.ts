/**
 * Shared helpers for the client-side image tools (compressor, resizer, cropper).
 * Everything here runs entirely in the browser — no uploads, no servers.
 */
import type { CSSProperties } from "react";

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OutputMime = "image/jpeg" | "image/png" | "image/webp";

/** Human-readable file size, e.g. 1.4 MB. */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Map a MIME type to a friendly file extension. */
export function extensionForMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/avif": "avif",
  };
  return map[mime.toLowerCase()] || mime.split("/")[1] || "img";
}

/** Strip the extension from a filename (keeps the rest intact). */
export function stripExtension(name: string): string {
  return name.replace(/\.[^./\\]+$/, "");
}

/** Load an <img> element from any URL (object/data/remote). Resolves once decoded. */
export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

/** Read the natural pixel dimensions of a File. */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Promise wrapper around canvas.toBlob. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: OutputMime = "image/png",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      type,
      quality
    );
  });
}

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Resize a File to the given pixel dimensions using a canvas and return a Blob.
 * High-quality smoothing is enabled for clean downscaling.
 */
export async function resizeImageToBlob(
  file: File,
  targetWidth: number,
  targetHeight: number,
  mime: OutputMime,
  quality = 0.92
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(targetWidth));
    canvas.height = Math.max(1, Math.round(targetHeight));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    // White matte when flattening to a format without alpha.
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await canvasToBlob(canvas, mime, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Bounding-box size of an image after rotation. */
function rotateSize(width: number, height: number, rotation: number) {
  const rad = toRadians(rotation);
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

/**
 * Produce a cropped (and optionally rotated) Blob from an image source and the
 * pixel-space crop area reported by react-easy-crop.
 */
export async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  mime: OutputMime = "image/png",
  quality = 0.92
): Promise<Blob> {
  const image = await loadImageElement(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Draw the full (rotated) image onto a bounding-box canvas.
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(toRadians(rotation));
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // Extract just the crop rectangle into a second canvas.
  const out = document.createElement("canvas");
  const outCtx = out.getContext("2d");
  if (!outCtx) throw new Error("Canvas not supported");
  out.width = Math.max(1, Math.round(pixelCrop.width));
  out.height = Math.max(1, Math.round(pixelCrop.height));
  if (mime === "image/jpeg") {
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, out.width, out.height);
  }
  outCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvasToBlob(out, mime, quality);
}

/** Shared checkerboard backdrop so transparent PNGs read clearly in previews. */
export const checkerStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, rgba(120,120,120,0.14) 25%, transparent 25%), linear-gradient(-45deg, rgba(120,120,120,0.14) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(120,120,120,0.14) 75%), linear-gradient(-45deg, transparent 75%, rgba(120,120,120,0.14) 75%)",
  backgroundSize: "18px 18px",
  backgroundPosition: "0 0, 0 9px, 9px -9px, -9px 0",
};

/** Resolve an "auto" (keep-original) format choice to a concrete output MIME. */
export function resolveOutputMime(
  choice: "auto" | OutputMime,
  fileType?: string
): OutputMime {
  if (choice !== "auto") return choice;
  if (fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/webp") {
    return fileType;
  }
  return "image/png";
}

/** Re-encode an image File into another format at its native resolution. */
export async function convertImageToBlob(
  file: File,
  mime: OutputMime,
  quality = 0.92
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    return await canvasToBlob(canvas, mime, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Rotate (any angle) and/or flip an image, returning a Blob. */
export async function transformImageToBlob(
  file: File,
  opts: {
    rotation?: number;
    flipH?: boolean;
    flipV?: boolean;
    mime: OutputMime;
    quality?: number;
  }
): Promise<Blob> {
  const { rotation = 0, flipH = false, flipV = false, mime, quality = 0.92 } = opts;
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    const { width: bw, height: bh } = rotateSize(img.width, img.height, rotation);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bw));
    canvas.height = Math.max(1, Math.round(bh));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.imageSmoothingQuality = "high";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(toRadians(rotation));
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    return await canvasToBlob(canvas, mime, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Apply a Gaussian blur to an image, returning a Blob. */
export async function blurImageToBlob(
  file: File,
  radius: number,
  mime: OutputMime,
  quality = 0.92
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(img, 0, 0);
    return await canvasToBlob(canvas, mime, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Pack a set of PNG blobs into a single .ico file. Modern .ico containers may
 * embed PNG data directly, so we build the ICONDIR header ourselves.
 */
export async function pngBlobsToIco(
  entries: { size: number; blob: Blob }[]
): Promise<Blob> {
  const images = await Promise.all(
    entries.map(async (e) => ({
      size: e.size,
      bytes: new Uint8Array(await e.blob.arrayBuffer()),
    }))
  );
  const count = images.length;
  const headerSize = 6 + 16 * count;
  const header = new Uint8Array(headerSize);
  const dv = new DataView(header.buffer);
  dv.setUint16(0, 0, true); // reserved
  dv.setUint16(2, 1, true); // image type: icon
  dv.setUint16(4, count, true);

  let offset = headerSize;
  const bodies: Uint8Array<ArrayBuffer>[] = [];
  images.forEach((img, i) => {
    const e = 6 + i * 16;
    const dim = img.size >= 256 ? 0 : img.size; // 0 means 256 in the spec
    header[e + 0] = dim; // width
    header[e + 1] = dim; // height
    header[e + 2] = 0; // palette
    header[e + 3] = 0; // reserved
    dv.setUint16(e + 4, 1, true); // color planes
    dv.setUint16(e + 6, 32, true); // bits per pixel
    dv.setUint32(e + 8, img.bytes.length, true); // data size
    dv.setUint32(e + 12, offset, true); // data offset
    offset += img.bytes.length;
    bodies.push(img.bytes);
  });

  return new Blob([header, ...bodies], { type: "image/x-icon" });
}
