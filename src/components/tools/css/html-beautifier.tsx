"use client";

import React from "react";
import { html as htmlLang } from "@codemirror/lang-html";
import beautify from "js-beautify";

import { FormatterTool } from "@/components/tools/css/css-tool-ui";

const SAMPLE = `<section class="hero"><h1>Hello</h1><p>Welcome to <a href="#">Notch Tools</a>.</p><ul><li>Fast</li><li>Free</li></ul></section>`;

export function HtmlBeautifier() {
  return (
    <FormatterTool
      transform={(s) => beautify.html(s, { indent_size: 2, wrap_line_length: 0, end_with_newline: false })}
      extension={htmlLang()}
      sample={SAMPLE}
      actionLabel="Beautify HTML"
      inputTitle="Minified / messy HTML"
      outputTitle="Beautified HTML"
      inputPlaceholder="Paste HTML to format…"
      outputPlaceholder="Formatted HTML appears here…"
      downloadName="beautified.html"
      downloadMime="text/html"
    />
  );
}
