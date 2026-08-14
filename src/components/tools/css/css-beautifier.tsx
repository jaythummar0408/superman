"use client";

import React from "react";
import { css as cssLang } from "@codemirror/lang-css";
import beautify from "js-beautify";

import { FormatterTool } from "@/components/tools/css/css-tool-ui";

const SAMPLE = `.card{display:flex;gap:1rem;padding:16px;border-radius:12px;background:#fff}.card h2{margin:0;font-size:1.25rem}`;

export function CssBeautifier() {
  return (
    <FormatterTool
      transform={(s) => beautify.css(s, { indent_size: 2, end_with_newline: false })}
      extension={cssLang()}
      sample={SAMPLE}
      actionLabel="Beautify CSS"
      inputTitle="Minified / messy CSS"
      outputTitle="Beautified CSS"
      inputPlaceholder="Paste CSS to format…"
      outputPlaceholder="Formatted CSS appears here…"
      downloadName="beautified.css"
      downloadMime="text/css"
    />
  );
}
