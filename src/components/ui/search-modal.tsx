import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { toolCategories } from "@/data/tools";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key and focus input when opened
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      
      // Calculate scrollbar width and add padding to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      
      // Reset query and focus input
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten and filter tools
  const allTools = toolCategories.flatMap((c) => c.tools);
  const filteredTools = query
    ? allTools.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/50 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl transform overflow-hidden rounded-xl border border-border/60 bg-white shadow-2xl transition-all dark:bg-card mx-4 animate-in zoom-in-95 duration-200">
        
        {/* Search Input Area */}
        <div className="flex items-center border-b border-border/40 px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            className="flex h-14 w-full rounded-md bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-muted-foreground/70 text-foreground"
            placeholder="Search for tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 transition-colors"
            aria-label="Close search"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query ? (
            filteredTools.length > 0 ? (
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tools
                </div>
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/50 dark:hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/50 dark:bg-background border border-border/40 text-muted-foreground group-hover:text-foreground transition-colors">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-semibold text-foreground">{tool.title}</span>
                        <span className="text-[12px] text-muted-foreground truncate">{tool.description}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-14 text-center text-[13px] text-muted-foreground">
                No results found for <span className="font-medium text-foreground">"{query}"</span>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Suggested Tools
              </div>
              {allTools.slice(0, 4).map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/50 dark:hover:bg-accent/20 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/50 dark:bg-background border border-border/40 text-muted-foreground group-hover:text-foreground transition-colors">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-foreground">{tool.title}</span>
                      <span className="text-[12px] text-muted-foreground truncate">{tool.description}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
