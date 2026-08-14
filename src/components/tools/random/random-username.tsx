"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Panel,
  SelectField,
  Slider,
  Toggle,
  ResultRow,
  CopyButton,
  pick,
  randInt,
} from "@/components/tools/random/random-ui";
import { ADJECTIVES, NOUNS } from "@/components/tools/random/data";

type Style = "camel" | "underscore" | "dash" | "lower";

function styleJoin(a: string, b: string, style: Style): string {
  switch (style) {
    case "camel":
      return a + b.charAt(0).toUpperCase() + b.slice(1);
    case "underscore":
      return `${a}_${b}`;
    case "dash":
      return `${a}-${b}`;
    default:
      return a + b;
  }
}

export function RandomUsername() {
  const [style, setStyle] = useState<Style>("underscore");
  const [numbers, setNumbers] = useState(true);
  const [count, setCount] = useState(6);
  const [names, setNames] = useState<string[]>([]);

  const generate = () => {
    const list = Array.from({ length: count }, () => {
      let u = styleJoin(pick(ADJECTIVES), pick(NOUNS), style);
      if (numbers) {
        const n = String(randInt(1, 999));
        u += style === "underscore" ? `_${n}` : style === "dash" ? `-${n}` : n;
      }
      return u;
    });
    setNames(list);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Options">
        <div className="space-y-5">
          <SelectField<Style>
            label="Style"
            value={style}
            onChange={setStyle}
            options={[
              { label: "under_score", value: "underscore" },
              { label: "camelCase", value: "camel" },
              { label: "with-dashes", value: "dash" },
              { label: "lowercase", value: "lower" },
            ]}
          />
          <Toggle label="Append random numbers" checked={numbers} onChange={setNumbers} />
          <Slider label="How many" value={count} onChange={setCount} min={1} max={30} />
          <Button className="w-full gap-2" onClick={generate}>
            <RefreshCw className="h-4 w-4" />
            Generate usernames
          </Button>
        </div>
      </Panel>

      <Panel
        title={names.length ? `${names.length} usernames` : "Usernames"}
        actions={names.length > 0 ? <CopyButton value={names.join("\n")} label="Copy all" /> : undefined}
      >
        {names.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Click generate to create usernames.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {names.map((n, i) => (
              <ResultRow key={i} value={n} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
