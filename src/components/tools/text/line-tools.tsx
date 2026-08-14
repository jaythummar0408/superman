"use client";

import React, { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  OutputPanel,
  Slider,
  Toggle,
  SelectField,
  StatusNote,
  monoTextareaClass,
} from "@/components/tools/text/text-tool-ui";

function InputPanel({
  value,
  onChange,
  children,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  children?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <Panel
      title="Input"
      actions={
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onChange("")}>
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      }
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${monoTextareaClass} min-h-[200px]`}
      />
      {children && <div className="mt-4 space-y-4">{children}</div>}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Text Repeater                                                      */
/* ------------------------------------------------------------------ */
type Sep = "newline" | "space" | "comma" | "none";
export function TextRepeater() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(5);
  const [sep, setSep] = useState<Sep>("newline");
  const [numbered, setNumbered] = useState(false);

  const output = useMemo(() => {
    if (!text) return "";
    const s = sep === "newline" ? "\n" : sep === "space" ? " " : sep === "comma" ? ", " : "";
    return Array.from({ length: count }, (_, i) => (numbered ? `${i + 1}. ${text}` : text)).join(s);
  }, [text, count, sep, numbered]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <InputPanel value={text} onChange={setText} placeholder="Text to repeat…">
        <Slider label="Repeat count" value={count} onChange={setCount} min={1} max={100} />
        <SelectField<Sep>
          label="Separator"
          value={sep}
          onChange={setSep}
          options={[
            { label: "New line", value: "newline" },
            { label: "Space", value: "space" },
            { label: "Comma", value: "comma" },
            { label: "None", value: "none" },
          ]}
        />
        <Toggle label="Number each repetition" checked={numbered} onChange={setNumbered} />
      </InputPanel>
      <OutputPanel value={output} downloadName="repeated.txt" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Remove Duplicate Lines                                             */
/* ------------------------------------------------------------------ */
export function RemoveDuplicates() {
  const [text, setText] = useState("");
  const [trim, setTrim] = useState(true);
  const [ci, setCi] = useState(false);
  const [dropEmpty, setDropEmpty] = useState(false);

  const { output, removed } = useMemo(() => {
    if (!text) return { output: "", removed: 0 };
    let lines = text.split("\n");
    if (trim) lines = lines.map((l) => l.trim());
    if (dropEmpty) lines = lines.filter((l) => l.trim());
    const seen = new Set<string>();
    const out: string[] = [];
    for (const l of lines) {
      const key = ci ? l.toLowerCase() : l;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(l);
      }
    }
    return { output: out.join("\n"), removed: lines.length - out.length };
  }, [text, trim, ci, dropEmpty]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <InputPanel value={text} onChange={setText} placeholder="Paste lines with duplicates…">
        <div className="flex flex-wrap gap-4">
          <Toggle label="Trim whitespace" checked={trim} onChange={setTrim} />
          <Toggle label="Case-insensitive" checked={ci} onChange={setCi} />
          <Toggle label="Remove empty lines" checked={dropEmpty} onChange={setDropEmpty} />
        </div>
        {text && <StatusNote variant="info">{removed} duplicate line{removed === 1 ? "" : "s"} removed.</StatusNote>}
      </InputPanel>
      <OutputPanel value={output} downloadName="deduped.txt" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sort Text Lines                                                    */
/* ------------------------------------------------------------------ */
type SortMode = "alpha" | "numeric" | "length";
type Order = "asc" | "desc";
export function SortLines() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<SortMode>("alpha");
  const [order, setOrder] = useState<Order>("asc");
  const [ci, setCi] = useState(false);
  const [unique, setUnique] = useState(false);
  const [dropEmpty, setDropEmpty] = useState(true);

  const output = useMemo(() => {
    if (!text) return "";
    let lines = text.split("\n");
    if (dropEmpty) lines = lines.filter((l) => l.trim());
    if (unique) lines = [...new Set(lines)];
    const cmp = (a: string, b: string) => {
      if (mode === "numeric") return (parseFloat(a) || 0) - (parseFloat(b) || 0);
      if (mode === "length") return a.length - b.length;
      const x = ci ? a.toLowerCase() : a;
      const y = ci ? b.toLowerCase() : b;
      return x.localeCompare(y);
    };
    lines.sort(cmp);
    if (order === "desc") lines.reverse();
    return lines.join("\n");
  }, [text, mode, order, ci, unique, dropEmpty]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <InputPanel value={text} onChange={setText} placeholder="Paste lines to sort…">
        <div className="grid grid-cols-2 gap-3">
          <SelectField<SortMode>
            label="Sort by"
            value={mode}
            onChange={setMode}
            options={[
              { label: "Alphabetical", value: "alpha" },
              { label: "Numeric", value: "numeric" },
              { label: "Line length", value: "length" },
            ]}
          />
          <SelectField<Order>
            label="Order"
            value={order}
            onChange={setOrder}
            options={[
              { label: "Ascending", value: "asc" },
              { label: "Descending", value: "desc" },
            ]}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Toggle label="Case-insensitive" checked={ci} onChange={setCi} />
          <Toggle label="Remove duplicates" checked={unique} onChange={setUnique} />
          <Toggle label="Remove empty lines" checked={dropEmpty} onChange={setDropEmpty} />
        </div>
      </InputPanel>
      <OutputPanel value={output} downloadName="sorted.txt" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reverse Text                                                       */
/* ------------------------------------------------------------------ */
type RevMode = "characters" | "words" | "lines";
export function ReverseText() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<RevMode>("characters");

  const output = useMemo(() => {
    if (!text) return "";
    if (mode === "characters") return [...text].reverse().join("");
    if (mode === "words") return text.split(/(\s+)/).reverse().join("");
    return text.split("\n").reverse().join("\n");
  }, [text, mode]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <InputPanel value={text} onChange={setText} placeholder="Text to reverse…">
        <SelectField<RevMode>
          label="Reverse by"
          value={mode}
          onChange={setMode}
          options={[
            { label: "Characters", value: "characters" },
            { label: "Words", value: "words" },
            { label: "Lines", value: "lines" },
          ]}
        />
      </InputPanel>
      <OutputPanel value={output} downloadName="reversed.txt" />
    </div>
  );
}
