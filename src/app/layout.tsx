import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { NavProgress } from "@/components/layout/nav-progress";
import { BackToTop } from "@/components/layout/back-to-top";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notch Tools",
  description: "A collection of useful developer and design tools",
  // iOS Safari auto-links numbers/dates, rewriting the DOM before React
  // hydrates — which broke search/toggle on mobile. Disabling it is the fix.
  formatDetection: { telephone: false, date: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <NavProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
