"use client";

import React from "react";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import beautify from "js-beautify";

import { FormatterTool } from "@/components/tools/css/css-tool-ui";

const SAMPLE = `const add=(a,b)=>a+b;function greet(name){if(!name){return"Hello there"}return"Hello, "+name}const nums=[1,2,3].map(n=>n*2);console.log(greet("world"),add(2,3),nums);`;

export function JsBeautifier() {
  return (
    <FormatterTool
      transform={(s) => beautify.js(s, { indent_size: 2, space_in_empty_paren: true, end_with_newline: false })}
      extension={jsLang()}
      sample={SAMPLE}
      actionLabel="Beautify JavaScript"
      inputTitle="Minified / messy JS"
      outputTitle="Beautified JS"
      inputPlaceholder="Paste JavaScript to format…"
      outputPlaceholder="Formatted JavaScript appears here…"
      downloadName="beautified.js"
      downloadMime="text/javascript"
    />
  );
}
