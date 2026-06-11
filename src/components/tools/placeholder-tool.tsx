import { Wrench, Clock, Construction } from "lucide-react";
import Link from "next/link";

interface PlaceholderToolProps {
  toolTitle: string;
}

export function PlaceholderTool({ toolTitle }: PlaceholderToolProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white dark:bg-card px-6 py-20 text-center shadow-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Construction className="h-10 w-10" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {toolTitle} is under construction
      </h2>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
        We're working hard to build this tool. It will be available very soon! 
        Check back later or explore our other available tools.
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-3 py-1.5 text-sm font-medium text-muted-foreground border border-border/50">
          <Clock className="h-4 w-4" />
          Coming Soon
        </span>
        <Link
          href="/categories"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Browse Tools
        </Link>
      </div>
    </div>
  );
}
