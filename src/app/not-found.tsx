import Link from "next/link";
import { ArrowLeft, Search, Wrench } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | Notch Tools",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-6 py-20 text-center lg:px-10">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Wrench className="h-12 w-12" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
        404
      </h1>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Page not found
      </h2>
      <p className="mt-4 max-w-[500px] text-base leading-relaxed text-muted-foreground">
        Oops! The tool or page you are looking for doesn't exist, has been moved, or is currently unavailable.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/categories"
          className="flex h-11 items-center justify-center gap-2 rounded-md border border-border/60 bg-white px-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted dark:bg-card w-full sm:w-auto"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          Browse Tools
        </Link>
      </div>
    </div>
  );
}
