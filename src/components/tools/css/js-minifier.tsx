"use client";

import React from "react";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { minify } from "terser";

import { FormatterTool } from "@/components/tools/css/css-tool-ui";

const SAMPLE = `// Sum an array of numbers
function sumArray(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

const values = [10, 20, 30, 40];
console.log("Total:", sumArray(values));`;

export function JsMinifier() {
  return (
    <FormatterTool
      transform={async (s) => {
        const result = await minify(s);
        return result.code ?? "";
      }}
      extension={jsLang()}
      sample={SAMPLE}
      actionLabel="Minify JavaScript"
      inputTitle="Source JavaScript"
      outputTitle="Minified JS"
      inputPlaceholder="Paste JavaScript to minify…"
      outputPlaceholder="Minified JavaScript appears here…"
      downloadName="minified.js"
      downloadMime="text/javascript"
      showStats
    />
  );
}
