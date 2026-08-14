"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, SelectField, Slider, ResultRow, CopyButton, pick } from "@/components/tools/random/random-ui";
import { FIRST_NAMES_MALE, FIRST_NAMES_FEMALE, LAST_NAMES } from "@/components/tools/random/data";

type Gender = "any" | "male" | "female";

export function RandomName() {
  const [gender, setGender] = useState<Gender>("any");
  const [count, setCount] = useState(6);
  const [names, setNames] = useState<string[]>([]);

  const generate = () => {
    const list = Array.from({ length: count }, () => {
      const pool =
        gender === "male"
          ? FIRST_NAMES_MALE
          : gender === "female"
          ? FIRST_NAMES_FEMALE
          : pick([FIRST_NAMES_MALE, FIRST_NAMES_FEMALE]);
      return `${pick(pool)} ${pick(LAST_NAMES)}`;
    });
    setNames(list);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Options">
        <div className="space-y-5">
          <SelectField<Gender>
            label="Gender"
            value={gender}
            onChange={setGender}
            options={[
              { label: "Any", value: "any" },
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
          />
          <Slider label="How many" value={count} onChange={setCount} min={1} max={30} />
          <Button className="w-full gap-2" onClick={generate}>
            <RefreshCw className="h-4 w-4" />
            Generate names
          </Button>
        </div>
      </Panel>

      <Panel
        title={names.length ? `${names.length} names` : "Names"}
        actions={names.length > 0 ? <CopyButton value={names.join("\n")} label="Copy all" /> : undefined}
      >
        {names.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Click generate to create names.</p>
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
