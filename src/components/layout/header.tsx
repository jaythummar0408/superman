"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SearchModal } from "@/components/ui/search-modal";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    const openSearch = () => setIsSearchOpen(true);
    document.addEventListener("keydown", down);
    window.addEventListener("notch:open-search", openSearch);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("notch:open-search", openSearch);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white dark:bg-card">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border/80 dark:border-border/40">
            <div className="h-2 w-2 rounded-full bg-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Notch Tools
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link
            href="/categories"
            className="hidden text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground md:block"
          >
            Categories
          </Link>

          <Link
            href="/favorites"
            aria-label="My favorites"
            className="hidden h-7 w-7 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-rose-500 md:flex"
            title="My favorites"
          >
            <Heart className="h-4 w-4" />
          </Link>

          {/* Desktop Search Input UI */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3 py-1.5 text-muted-foreground transition-colors hover:border-border hover:text-foreground w-48 lg:w-64"
            aria-label="Search tools"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left text-[13px] font-normal">Search tools...</span>
            <kbd className="hidden lg:inline-flex h-[18px] items-center gap-0.5 rounded border border-border/40 bg-background px-1.5 font-sans text-[10px] font-medium text-muted-foreground">
              <span>⌘</span>K
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <ThemeToggle />

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </>
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-12 z-50 border-b border-border/40 bg-white dark:bg-card">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-6 py-3 lg:px-10">
            {[
              { href: "/categories", label: "Categories" },
              { href: "/favorites", label: "Favorites" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
