import React from "react";
import { PlaceholderTool } from "./placeholder-tool";
import { PdfMerger } from "./pdf/pdf-merger";

// Import your actual tool components here as you build them.
// Example:
// import { ImageCompressor } from "./image/image-compressor";
// import { JsonFormatter } from "./dev/json-formatter";

interface ToolRegistryProps {
  slug: string;
  toolTitle: string;
}

/**
 * The ToolRegistry maps a URL slug to a specific React component containing the tool's logic.
 * If a tool hasn't been built yet, it gracefully falls back to a Placeholder component.
 */
export function ToolRegistry({ slug, toolTitle }: ToolRegistryProps) {
  // Map of slugs to their respective functional components
  const toolComponents: Record<string, React.FC> = {
    "pdf-merger": PdfMerger,
    // "image-compressor": ImageCompressor,
    // "json-formatter": JsonFormatter,
    // Add more tools here as they are developed
  };

  const Component = toolComponents[slug];

  // Render the specific tool if it exists, otherwise render the placeholder
  if (Component) {
    return <Component />;
  }

  return <PlaceholderTool toolTitle={toolTitle} />;
}
