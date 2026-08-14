"use client";

import React, { useState } from "react";
import { Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, Field, SelectField, Slider, StatusNote, monoTextareaClass, shuffle } from "@/components/tools/random/random-ui";

type Mode = "teams" | "size";
const SAMPLE = "Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry";

export function RandomTeam() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("teams");
  const [value, setValue] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    setError(null);
    const names = text.split("\n").map((n) => n.trim()).filter(Boolean);
    if (names.length < 2) return setError("Enter at least two names, one per line.");
    const pool = shuffle(names);

    let result: string[][];
    if (mode === "teams") {
      const t = Math.min(value, pool.length);
      result = Array.from({ length: t }, () => [] as string[]);
      pool.forEach((n, i) => result[i % t].push(n)); // round-robin = balanced
    } else {
      result = [];
      for (let i = 0; i < pool.length; i += value) result.push(pool.slice(i, i + value));
    }
    setTeams(result);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Players">
        <div className="space-y-4">
          <Field label="Names" hint="one per line">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={SAMPLE}
              className={`${monoTextareaClass} min-h-[160px]`}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <SelectField<Mode>
              label="Split by"
              value={mode}
              onChange={setMode}
              options={[
                { label: "Number of teams", value: "teams" },
                { label: "Players per team", value: "size" },
              ]}
            />
            <div className="flex items-end pb-1">
              <div className="w-full">
                <Slider label={mode === "teams" ? "Teams" : "Team size"} value={value} onChange={setValue} min={2} max={12} />
              </div>
            </div>
          </div>
          <Button className="w-full gap-2" onClick={generate}>
            <Shuffle className="h-4 w-4" />
            Generate teams
          </Button>
          {error && <StatusNote variant="error">{error}</StatusNote>}
        </div>
      </Panel>

      <Panel title={teams.length ? `${teams.length} teams` : "Teams"}>
        {teams.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Add names and generate to split into teams.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {teams.map((team, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Team {i + 1}</span>
                  <span className="text-xs text-muted-foreground">{team.length}</span>
                </div>
                <ul className="space-y-1">
                  {team.map((n, j) => (
                    <li key={j} className="truncate text-sm text-foreground">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
