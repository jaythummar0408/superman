import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { toolCategories } from "@/data/tools";
import { ToolCard } from "@/components/ui/tool-card";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, categoryItemListJsonLd } from "@/lib/seo";

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all categories so they can be pre-rendered
export function generateStaticParams() {
  return toolCategories.map((category) => ({
    slug: category.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = toolCategories.find((c) => slugify(c.name) === slug);

  if (!category) return { title: "Category Not Found" };

  const path = `/categories/${slug}`;
  return {
    title: category.name,
    description: category.description,
    keywords: [category.name.toLowerCase(), `${category.name.toLowerCase()} online`, "free online tools"],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${category.name} | ${siteConfig.name}`,
      description: category.description,
      url: path,
      siteName: siteConfig.name,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = toolCategories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-8 lg:py-12">
      <JsonLd data={categoryItemListJsonLd(category)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Categories", url: "/categories" },
          { name: category.name, url: `/categories/${slugify(category.name)}` },
        ])}
      />
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center text-sm font-medium text-muted-foreground">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="mr-1.5 h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link
          href="/categories"
          className="hover:text-foreground transition-colors"
        >
          Categories
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.tools.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>
    </div>
  );
}
