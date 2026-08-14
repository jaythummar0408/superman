import * as pdfjsLib from "pdfjs-dist";

// The worker is served from /public (copied from the installed pdfjs-dist so the
// versions always match). This avoids bundler-specific worker-URL resolution.
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export { pdfjsLib };
