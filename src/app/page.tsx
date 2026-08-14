import type { Metadata } from "next";

import { Hero } from "@/components/layout/hero";
import { WhyUse } from "@/components/layout/why-use";
import { ToolSection } from "@/components/ui/tool-section";
import { Reveal } from "@/components/ui/reveal";
import { Favorites } from "@/components/ui/favorites";
import { JsonLd } from "@/components/seo/json-ld";
import { websiteJsonLd, organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { toolCategories } from "@/data/tools";

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — Free Online Tools for Developers & Designers` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      <Hero />

      <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10">
        {/* Personalized favorites (client, shows only when the user has some) */}
        <Favorites variant="home" />

        {/* Category quick-nav */}
        <nav className="scrollbar-none mb-2 flex gap-2 overflow-x-auto pb-1">
          {toolCategories.map((category) => (
            <a
              key={category.name}
              href={`#${slugify(category.name)}`}
              className="shrink-0 rounded-full border border-border/60 bg-white px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground dark:bg-card"
            >
              {category.name}
            </a>
          ))}
        </nav>

        {toolCategories.map((category) => (
          <Reveal key={category.name}>
            <ToolSection
              id={slugify(category.name)}
              name={category.name}
              description={category.description}
              tools={category.tools}
            />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <WhyUse />
      </Reveal>
    </>
  );
}
