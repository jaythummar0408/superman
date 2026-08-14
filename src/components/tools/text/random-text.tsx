"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, OutputPanel, Slider, SelectField } from "@/components/tools/text/text-tool-ui";

type Charset = "alphanumeric" | "alpha" | "lowercase" | "uppercase" | "numeric" | "hex" | "symbols";

const SETS: Record<Charset, string> = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numeric: "0123456789",
  hex: "0123456789abcdef",
  symbols: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+",
};

function randInt(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

export function RandomText() {
  const [charset, setCharset] = useState<Charset>("alphanumeric");
  const [length, setLength] = useState(24);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  const generate = () => {
    const pool = SETS[charset];
    const lines = Array.from({ length: count }, () =>
      Array.from({ length }, () => pool[randInt(pool.length)]).join("")
    );
    setOutput(lines.join("\n"));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Options">
        <div className="space-y-4">
          <SelectField<Charset>
            label="Character set"
            value={charset}
            onChange={setCharset}
            options={[
              { label: "Alphanumeric (A-Z, a-z, 0-9)", value: "alphanumeric" },
              { label: "Letters (A-Z, a-z)", value: "alpha" },
              { label: "Lowercase (a-z)", value: "lowercase" },
              { label: "Uppercase (A-Z)", value: "uppercase" },
              { label: "Numbers (0-9)", value: "numeric" },
              { label: "Hexadecimal (0-9, a-f)", value: "hex" },
              { label: "Alphanumeric + symbols", value: "symbols" },
            ]}
          />
          <Slider label="Length per string" value={length} onChange={setLength} min={1} max={128} />
          <Slider label="How many strings" value={count} onChange={setCount} min={1} max={50} />
          <Button className="w-full gap-2" onClick={generate}>
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </Panel>
      <OutputPanel value={output} downloadName="random-text.txt" placeholder="Generated strings appear here…" />
    </div>
  );
}
