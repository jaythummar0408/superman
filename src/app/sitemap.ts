import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { toolCategories } from "@/data/tools";

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${siteConfig.url}${p}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/categories"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = toolCategories.map((c) => ({
    url: url(`/categories/${slugify(c.name)}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = toolCategories
    .flatMap((c) => c.tools)
    .map((t) => ({
      url: url(t.href),
      lastModified: now,
      changeFrequency: "monthly",
      priority: t.available ? 0.7 : 0.4,
    }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
