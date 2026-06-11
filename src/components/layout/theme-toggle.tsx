"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = async () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";

    // Check if View Transitions API is supported
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(newTheme);
      return;
    }

    // Get the button position to animate from
    const button = buttonRef.current;
    if (!button) {
      setTheme(newTheme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the max radius needed to cover the entire page
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Set CSS custom properties for the animation origin
    document.documentElement.style.setProperty("--theme-toggle-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-toggle-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-toggle-r", `${maxRadius}px`);

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    await transition.ready;

    // Animate the circular clip-path
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
        <span className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      className="relative h-8 w-8 rounded-full hover:bg-accent transition-colors duration-200"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
