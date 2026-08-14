"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, OutputPanel, Slider, SelectField, Toggle } from "@/components/tools/text/text-tool-ui";

const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et " +
  "dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea " +
  "commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur " +
  "excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum"
).split(" ");

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = () => WORDS[rand(WORDS.length)];

function sentence(): string {
  const len = 8 + rand(9); // 8–16 words
  const words = Array.from({ length: len }, pick);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  // sprinkle a comma
  if (len > 10) words[Math.floor(len / 2)] += ",";
  return words.join(" ") + ".";
}

function paragraph(): string {
  const len = 3 + rand(4); // 3–6 sentences
  return Array.from({ length: len }, sentence).join(" ");
}

type Unit = "paragraphs" | "sentences" | "words";

export function LoremIpsum() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [amount, setAmount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [output, setOutput] = useState("");

  const generate = () => {
    let result: string;
    if (unit === "words") {
      result = Array.from({ length: amount }, pick).join(" ");
      result = result.charAt(0).toUpperCase() + result.slice(1) + ".";
    } else if (unit === "sentences") {
      result = Array.from({ length: amount }, sentence).join(" ");
    } else {
      result = Array.from({ length: amount }, paragraph).join("\n\n");
    }
    if (startClassic) {
      result = result.replace(/^\S+ \S+/, "Lorem ipsum");
    }
    setOutput(result);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Options">
        <div className="space-y-4">
          <SelectField<Unit>
            label="Generate"
            value={unit}
            onChange={setUnit}
            options={[
              { label: "Paragraphs", value: "paragraphs" },
              { label: "Sentences", value: "sentences" },
              { label: "Words", value: "words" },
            ]}
          />
          <Slider label="Amount" value={amount} onChange={setAmount} min={1} max={unit === "words" ? 200 : 20} />
          <Toggle label='Start with "Lorem ipsum"' checked={startClassic} onChange={setStartClassic} />
          <Button className="w-full gap-2" onClick={generate}>
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </Panel>
      <OutputPanel value={output} downloadName="lorem-ipsum.txt" placeholder="Placeholder text appears here…" />
    </div>
  );
}
