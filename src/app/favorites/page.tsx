import type { Metadata } from "next";
import { Heart } from "lucide-react";

import { Favorites } from "@/components/ui/favorites";

export const metadata: Metadata = {
  title: "My Favorite Tools",
  description: "Your personal collection of favorite Notch Tools, saved for quick access and everyday use.",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My Favorites</h1>
        <p className="mt-3 text-base text-muted-foreground">The tools you use most, all in one place.</p>
      </div>

      <Favorites variant="page" />
    </div>
  );
}
