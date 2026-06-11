import { ToolCard, Tool } from "@/components/ui/tool-card";
import {
  Image,
  Code,
  Paintbrush,
  Type,
  Wrench,
  Shield,
  Share2,
  FileText,
  Dices,
  Timer,
  type LucideIcon,
} from "lucide-react";

interface ToolSectionProps {
  name: string;
  description: string;
  tools: Tool[];
}

const categoryIcons: Record<string, LucideIcon> = {
  "Image Tools": Image,
  "Dev Tools": Code,
  "CSS Tools": Paintbrush,
  "Text Tools": Type,
  "Utility Tools": Wrench,
  "Security Tools": Shield,
  "Social Media Tools": Share2,
  "PDF Tools": FileText,
  "Random Generators": Dices,
  "Countdown Tools": Timer,
};

export function ToolSection({ name, description, tools }: ToolSectionProps) {
  const CategoryIcon = categoryIcons[name] || Wrench;

  return (
    <section className="py-8">
      {/* Category Header */}
      <div className="mb-5  pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-card dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
            <CategoryIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground leading-tight">{name}</h2>
            <p className="mt-1 text-[14px] text-muted-foreground leading-snug">{description}</p>
          </div>
        </div>
      </div>

      {/* Cards Grid - 3 columns */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>
    </section>
  );
}
