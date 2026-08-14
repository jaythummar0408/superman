import { Hero } from "@/components/layout/hero";
import { ToolSection } from "@/components/ui/tool-section";
import { Reveal } from "@/components/ui/reveal";
import { toolCategories } from "@/data/tools";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-[1400px] px-6 py-2 lg:px-10">
        {toolCategories.map((category) => (
          <Reveal key={category.name}>
            <ToolSection
              name={category.name}
              description={category.description}
              tools={category.tools}
            />
          </Reveal>
        ))}
      </div>
    </>
  );
}
