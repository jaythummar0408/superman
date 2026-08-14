import Link from "next/link";
import { type LucideIcon } from "lucide-react";

export interface ToolFeature {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface ToolStep {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface ToolFaq {
  q: string;
  a: string;
}

export interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  /** Set to true once a tool is fully built — swaps the "Coming soon" badge for a "Live" badge. */
  available?: boolean;
  features?: ToolFeature[];
  steps?: ToolStep[];
  faqs?: ToolFaq[];
}

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className="group flex items-start gap-3.5 rounded-lg bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:bg-card dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground/80 transition-colors duration-200 group-hover:text-foreground" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[13px] font-semibold text-foreground leading-tight">
            {tool.title}
          </h3>
          {tool.available ? (
            <span className="mt-0.5 shrink-0 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-[1px] text-[9px] font-medium text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-400">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              Live
            </span>
          ) : (
            <span className="mt-0.5 shrink-0 inline-flex items-center rounded-full bg-secondary/60 px-1.5 py-[1px] text-[9px] font-medium text-muted-foreground border border-border/50">
              Coming soon
            </span>
          )}
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
