"use client";

import React from "react";
import { css as cssLang } from "@codemirror/lang-css";
import { minify } from "csso";

import { FormatterTool } from "@/components/tools/css/css-tool-ui";

const SAMPLE = `.card {
  display: flex;
  gap: 1rem;
  padding: 16px 16px 16px 16px;
  border-radius: 12px;
  background: #ffffff;
  color: #333333;
}

/* headings */
.card h2 {
  margin: 0;
  font-size: 1.25rem;
}`;

export function CssMinifier() {
  return (
    <FormatterTool
      transform={(s) => minify(s).css}
      extension={cssLang()}
      sample={SAMPLE}
      actionLabel="Minify CSS"
      inputTitle="Source CSS"
      outputTitle="Minified CSS"
      inputPlaceholder="Paste CSS to minify…"
      outputPlaceholder="Minified CSS appears here…"
      downloadName="minified.css"
      downloadMime="text/css"
      showStats
    />
  );
}
