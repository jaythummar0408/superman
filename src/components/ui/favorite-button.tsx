"use client";

import React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { toggleFavorite, useIsFavorite } from "@/lib/use-favorites";

export function FavoriteButton({
  href,
  title,
  className,
  size = "sm",
}: {
  href: string;
  title?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const active = useIsFavorite(href);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(href);
    toast.success(active ? "Removed from favorites" : "Added to favorites");
  };

  const box = size === "md" ? "h-9 w-9" : "h-7 w-7";
  const icon = size === "md" ? "h-4.5 w-4.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${title ?? "tool"} from favorites` : `Add ${title ?? "tool"} to favorites`}
      title={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition-colors",
        box,
        active
          ? "text-rose-500 hover:text-rose-600"
          : "text-muted-foreground/50 hover:text-rose-500",
        className
      )}
    >
      <Heart className={cn(icon, active && "fill-current")} strokeWidth={2} />
    </button>
  );
}
