import { toolCategories } from "@/data/tools";
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
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

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

export const metadata = {
  title: "Categories | Notch Tools",
  description: "Browse all tool categories on Notch Tools.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Tool Categories
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse our extensive collection of tools by category.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {toolCategories.map((category) => {
          const Icon = categoryIcons[category.name] || Wrench;

          return (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative flex flex-col rounded-xl border border-border/40 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md dark:bg-card"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-semibold text-foreground leading-tight">
                    {category.name}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex w-full items-center justify-between border-t border-border/40 pt-4">
                <span className="text-xs font-medium text-muted-foreground">
                  {category.tools.length} Tools
                </span>
                <span className="flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Browse <ChevronRight className="ml-1 h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
