"use client";

import React, { useMemo, useState } from "react";

import {
  Panel,
  Field,
  SelectField,
  Toggle,
  CopyButton,
  monoTextareaClass,
  controlInputClass,
} from "@/components/tools/text/text-tool-ui";

type Sep = "-" | "_";

function slugify(text: string, sep: Sep, lower: boolean, strip: boolean): string {
  let s = text;
  if (strip) s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  s = s.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  const parts = s ? s.split(/\s+/) : [];
  let slug = parts.join(sep);
  if (lower) slug = slug.toLowerCase();
  return slug;
}

export function SlugGenerator() {
  const [text, setText] = useState("");
  const [sep, setSep] = useState<Sep>("-");
  const [lower, setLower] = useState(true);
  const [strip, setStrip] = useState(true);

  const slug = useMemo(() => slugify(text, sep, lower, strip), [text, sep, lower, strip]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel title="Text to slugify">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 10 Best Tips for Productivity in 2026!"
            className={`${monoTextareaClass} min-h-[80px]`}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField<Sep>
              label="Separator"
              value={sep}
              onChange={setSep}
              options={[
                { label: "Hyphen ( - )", value: "-" },
                { label: "Underscore ( _ )", value: "_" },
              ]}
            />
            <div className="flex flex-col justify-end gap-2 pb-1">
              <Toggle label="Lowercase" checked={lower} onChange={setLower} />
              <Toggle label="Strip accents" checked={strip} onChange={setStrip} />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Slug" actions={<CopyButton value={slug} />}>
        <Field label="URL-friendly slug">
          <input
            value={slug}
            readOnly
            placeholder="your-slug-appears-here"
            className={`${controlInputClass} font-mono`}
          />
        </Field>
      </Panel>
    </div>
  );
}
