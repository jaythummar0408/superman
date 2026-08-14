import { notFound } from "next/navigation";
import { toolCategories } from "@/data/tools";
import { ChevronRight, Home, Upload, Settings, Download, ShieldCheck, Zap, CloudOff, Smartphone, CircleCheck, Gift } from "lucide-react";
import Link from "next/link";
import { ToolRegistry } from "@/components/tools/tool-registry";
import { Reveal } from "@/components/ui/reveal";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, softwareAppJsonLd } from "@/lib/seo";

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper function to find a tool and its category by slug
function findToolBySlug(slug: string) {
  for (const category of toolCategories) {
    const tool = category.tools.find(
      (t) => t.href.split("/").pop() === slug
    );
    if (tool) {
      return { tool, category };
    }
  }
  return null;
}

// Generate static params for all tools so they can be pre-rendered
export function generateStaticParams() {
  const params: { slug: string }[] = [];
  toolCategories.forEach((category) => {
    category.tools.forEach((tool) => {
      const slug = tool.href.split("/").pop();
      if (slug) {
        params.push({ slug });
      }
    });
  });
  return params;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = findToolBySlug(slug);

  if (!data) return { title: "Tool Not Found" };

  const { tool, category } = data;
  const path = tool.href;
  const keywords = [
    tool.title.toLowerCase(),
    `${tool.title.toLowerCase()} online`,
    `free ${tool.title.toLowerCase()}`,
    category.name.toLowerCase(),
    "online tool",
  ];

  return {
    title: tool.title,
    description: tool.description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
      url: path,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const data = findToolBySlug(slug);

  if (!data) {
    notFound();
  }

  const { tool, category } = data;
  const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-");

  const defaultSteps = [
    { icon: Upload, title: "1. Upload or Input", desc: "Select or drag and drop your file, or enter your text input into the tool." },
    { icon: Settings, title: "2. Configure Options", desc: "Adjust the settings according to your specific needs and preferences." },
    { icon: Download, title: "3. Get Results", desc: "Click process and instantly download or copy your optimized results." }
  ];

  const defaultFeatures = [
    { icon: ShieldCheck, title: "100% Secure", desc: "Your data is encrypted and automatically deleted after processing. Complete privacy guaranteed." },
    { icon: Zap, title: "Lightning Fast", desc: "Advanced algorithms process your requests in seconds without compromising quality." },
    { icon: CloudOff, title: "No Installation", desc: "Works entirely in your browser. No software downloads or installations required." },
    { icon: Smartphone, title: "Mobile Friendly", desc: "Fully optimized for smartphones and tablets. Use our tools on any device, anywhere." },
    { icon: CircleCheck, title: "Quality Preserved", desc: "We ensure that your output maintains the highest possible quality standard." },
    { icon: Gift, title: "Free Forever", desc: "No hidden costs, subscriptions, or limits. Use our tools completely free of charge." }
  ];

  const defaultFaqs = [
    { q: "How do I use this tool?", a: "Simply upload your file or enter your data in the input area, configure your desired settings, and click the process button to get your results." },
    { q: "Is it free to use?", a: "Yes! All tools on Notch Tools are 100% free to use with no hidden fees or subscriptions." },
    { q: "Is my data secure?", a: "Absolutely. Most of our tools process data entirely within your browser. For tools that require server processing, data is encrypted and deleted immediately after." },
    { q: "Do I need to install any software?", a: "No, everything runs directly in your web browser. There is nothing to download or install." },
    { q: "Can I use this on my mobile device?", a: "Yes, our website is fully responsive and optimized to work smoothly on smartphones and tablets." },
    { q: "Are there any usage limits?", a: "We currently do not impose strict usage limits, allowing you to process as many files as you need." }
  ];

  const stepsToRender = tool.steps || defaultSteps;
  const featuresToRender = tool.features || defaultFeatures;
  const faqsToRender = tool.faqs || defaultFaqs;

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-8 lg:py-12">
      <JsonLd data={softwareAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Categories", url: "/categories" },
          { name: category.name, url: `/categories/${categorySlug}` },
          { name: tool.title, url: tool.href },
        ])}
      />
      {/* Breadcrumbs */}
      <nav className="mb-8 flex flex-wrap items-center text-sm font-medium text-muted-foreground gap-y-2">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors shrink-0"
        >
          <Home className="mr-1.5 h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="mx-2 h-4 w-4 shrink-0" />
        <Link
          href="/categories"
          className="hover:text-foreground transition-colors shrink-0"
        >
          Categories
        </Link>
        <ChevronRight className="mx-2 h-4 w-4 shrink-0" />
        <Link
          href={`/categories/${categorySlug}`}
          className="hover:text-foreground transition-colors shrink-0"
        >
          {category.name}
        </Link>
        <ChevronRight className="mx-2 h-4 w-4 shrink-0" />
        <span className="text-foreground shrink-0">{tool.title}</span>
      </nav>

      {/* Tool Header */}
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/50 bg-primary/5 text-primary">
          <tool.icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tool.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Dynamic Tool Content Rendered via Registry */}
      <div className="mx-auto max-w-4xl min-h-[300px] mb-24">
        <ToolRegistry slug={slug} toolTitle={tool.title} />
      </div>

      {/* How to Use Section */}
      <Reveal>
      <section className="mx-auto max-w-5xl mb-24">
        <h2 className="text-2xl font-bold text-center text-foreground mb-10">
          How to Use {tool.title}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {stepsToRender.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center rounded-xl bg-white dark:bg-card p-8 border border-border/40 shadow-sm transition-all hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Why Choose Us Section */}
      <Reveal>
      <section className="mx-auto max-w-5xl mb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">
            Why Choose Our {tool.title}?
          </h2>
          <p className="mt-3 text-muted-foreground">Powerful features designed to make your workflow simple, fast, and secure.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuresToRender.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center rounded-xl bg-white dark:bg-card p-6 border border-border/40 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-foreground">
                <feature.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* FAQ Section */}
      <Reveal>
      <section className="mx-auto max-w-3xl mb-12">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-3">
          {faqsToRender.map((faq, i) => (
            <div key={i} className="flex flex-col rounded-lg border border-border/40 bg-white dark:bg-card px-5 py-4 cursor-pointer hover:border-border transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-y-0.5 group-hover:rotate-90" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground hidden group-hover:block transition-all">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>
    </div>
  );
}
