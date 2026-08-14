"use client";

import React, { useMemo, useState } from "react";

import { Panel, Field, OutputBox, controlInputClass, monoTextareaClass } from "@/components/tools/social/social-tool-ui";

export function YoutubeDescriptionGenerator() {
  const [summary, setSummary] = useState("");
  const [points, setPoints] = useState("");
  const [cta, setCta] = useState("If this helped, hit like and subscribe for more!");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [hashtags, setHashtags] = useState("");

  const output = useMemo(() => {
    const parts: string[] = [];
    if (summary.trim()) parts.push(summary.trim());

    const pts = points
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (pts.length) parts.push("▶ In this video:\n" + pts.map((p) => `• ${p}`).join("\n"));

    if (cta.trim()) parts.push(`👉 ${cta.trim()}`);

    const links: string[] = [];
    if (website.trim()) links.push(`🌐 Website: ${website.trim()}`);
    if (instagram.trim()) links.push(`📸 Instagram: ${instagram.trim()}`);
    if (twitter.trim()) links.push(`🐦 X/Twitter: ${twitter.trim()}`);
    if (links.length) parts.push("🔗 Links:\n" + links.join("\n"));

    const tags = hashtags
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean)
      .map((t) => `#${t}`);
    if (tags.length) parts.push(tags.join(" "));

    return parts.join("\n\n");
  }, [summary, points, cta, website, instagram, twitter, hashtags]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Video details">
        <div className="space-y-4">
          <Field label="Short summary / intro">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What is this video about?"
              className={`${monoTextareaClass} min-h-[70px]`}
            />
          </Field>
          <Field label="Key points" hint="one per line">
            <textarea
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder={"Intro & overview\nStep 1: ...\nFinal tips"}
              className={`${monoTextareaClass} min-h-[90px]`}
            />
          </Field>
          <Field label="Call to action">
            <input value={cta} onChange={(e) => setCta(e.target.value)} className={controlInputClass} />
          </Field>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Website">
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" className={controlInputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Instagram">
                <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle" className={controlInputClass} />
              </Field>
              <Field label="X / Twitter">
                <input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@handle" className={controlInputClass} />
              </Field>
            </div>
          </div>
          <Field label="Hashtags / keywords" hint="comma or space separated">
            <input value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="tutorial, howto, tips" className={controlInputClass} />
          </Field>
        </div>
      </Panel>

      <OutputBox title="Generated description" value={output} limit={5000} />
    </div>
  );
}
