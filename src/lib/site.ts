/**
 * Central site configuration used for SEO metadata, sitemap, and structured data.
 * Set NEXT_PUBLIC_SITE_URL in your environment to your real domain in production.
 */
export const siteConfig = {
  name: "Notch Tools",
  shortName: "Notch",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://notchtools.com").replace(/\/$/, ""),
  description:
    "120+ free, fast, privacy-first online tools for developers, designers and creators — image, PDF, CSS, text, security, converters and more. No sign-up, everything runs in your browser.",
  keywords: [
    "online tools",
    "free online tools",
    "developer tools",
    "image tools",
    "pdf tools",
    "css generator",
    "text tools",
    "password generator",
    "unit converter",
    "qr code generator",
  ],
  locale: "en_US",
  twitter: "@notchtools",
};

export type SiteConfig = typeof siteConfig;
