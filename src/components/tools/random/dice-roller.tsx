"use client";

import React, { useState } from "react";
import { Dices } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Panel, Slider, SelectField, randInt } from "@/components/tools/random/random-ui";

type Sides = "4" | "6" | "8" | "10" | "12" | "20" | "100";

// Pip layouts for a standard six-sided die.
const PIPS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

function D6Face({ value }: { value: number }) {
  const cells = PIPS[value] ?? [];
  return (
    <div className="grid h-16 w-16 grid-cols-3 grid-rows-3 gap-0.5 p-2">
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const on = cells.some(([r, c]) => r === row && c === col);
        return <span key={i} className={cn("m-auto h-2.5 w-2.5 rounded-full", on ? "bg-foreground" : "bg-transparent")} />;
      })}
    </div>
  );
}

export function DiceRoller() {
  const [sides, setSides] = useState<Sides>("6");
  const [count, setCount] = useState(2);
  const [rolls, setRolls] = useState<number[]>([]);

  const roll = () => {
    const s = Number(sides);
    setRolls(Array.from({ length: count }, () => randInt(1, s)));
  };

  const total = rolls.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel title="Options">
        <div className="space-y-5">
          <SelectField<Sides>
            label="Dice type"
            value={sides}
            onChange={setSides}
            options={(["4", "6", "8", "10", "12", "20", "100"] as Sides[]).map((s) => ({ label: `d${s}`, value: s }))}
          />
          <Slider label="Number of dice" value={count} onChange={setCount} min={1} max={10} />
          <Button className="w-full gap-2" onClick={roll}>
            <Dices className="h-4 w-4" />
            Roll {count > 1 ? `${count} dice` : "die"}
          </Button>
        </div>
      </Panel>

      {rolls.length > 0 && (
        <Panel title="Result">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3">
              {rolls.map((r, i) => (
                <div
                  key={i}
                  className="flex h-16 w-16 items-center justify-center rounded-xl border border-border/60 bg-muted/20 text-2xl font-bold text-foreground shadow-sm"
                >
                  {sides === "6" ? <D6Face value={r} /> : r}
                </div>
              ))}
            </div>
            {rolls.length > 1 && (
              <div className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                Total: {total}
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}
