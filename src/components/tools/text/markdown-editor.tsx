"use client";

import React, { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

import { Panel, CopyButton, monoTextareaClass } from "@/components/tools/text/text-tool-ui";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/components/tools/text/text-tool-ui";

const SAMPLE = `# Markdown Editor

Write **Markdown** on the left and see the _rendered_ result on the right.

## Features
- Live preview
- Lists, **bold**, _italic_, and \`code\`
- [Links](https://example.com) and quotes

> Blockquotes look like this.

\`\`\`js
console.log("Hello, world!");
\`\`\`
`;

// Child-element styling for the rendered preview (no typography plugin needed).
const PROSE =
  "text-sm leading-relaxed text-foreground " +
  "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold " +
  "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold " +
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold " +
  "[&_p]:my-2 [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_em]:italic " +
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 " +
  "[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] " +
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_pre]:text-zinc-100 " +
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-zinc-100 " +
  "[&_hr]:my-4 [&_hr]:border-border [&_table]:my-3 [&_table]:w-full [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 " +
  "[&_td]:border [&_td]:border-border/60 [&_td]:px-2 [&_td]:py-1 [&_img]:max-w-full [&_img]:rounded-lg";

export function MarkdownEditor() {
  const [md, setMd] = useState(SAMPLE);

  const html = useMemo(() => {
    const raw = marked.parse(md, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [md]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel
        title="Markdown"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setMd(SAMPLE)}>
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMd("")}>
              Clear
            </Button>
          </>
        }
      >
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          placeholder="# Type your markdown here…"
          className={`${monoTextareaClass} min-h-[360px]`}
        />
      </Panel>

      <Panel
        title="Preview"
        actions={
          <>
            <CopyButton value={html} label="Copy HTML" />
            <Button
              variant="outline"
              size="sm"
              disabled={!md}
              onClick={() => downloadText("document.html", html, "text/html")}
            >
              Download
            </Button>
          </>
        }
      >
        <div
          className={`min-h-[360px] overflow-auto rounded-lg border border-border/50 bg-muted/5 p-4 ${PROSE}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Panel>
    </div>
  );
}
