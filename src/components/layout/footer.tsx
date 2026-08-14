import Link from "next/link";
import { Coffee } from "lucide-react";

const footerLinks = [
  { href: "/categories", label: "Categories" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-card">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Footer Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-7">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px w-full bg-border/60" />

        {/* Copyright Bar */}
        <div className="flex items-center justify-between py-5">
          <p className="text-[12px] text-muted-foreground">
            Copyright &copy; {currentYear} - All rights reserved
          </p>

          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted-foreground transition-colors duration-200 hover:text-amber-500"
            aria-label="Buy me a coffee"
          >
            <Coffee className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          </a>
        </div>
      </div>
    </footer>
  );
}
