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
  // iOS Safari auto-linking numbers/dates rewrites the DOM before React
  // hydrates, which can abort hydration on mobile — disable it.
  formatDetection: { telephone: false, date: false, address: false, email: false },
};

// Inline diagnostic: surfaces any client-side JS error on screen so it can be
// read on a real device where the console isn't accessible. Runs independently
// of the React bundle, so it catches script parse/load failures too.
const DIAG_SCRIPT = `(function(){function show(m){try{if(!document.body){window.addEventListener('DOMContentLoaded',function(){show(m)});return;}var el=document.getElementById('__diag');if(!el){el=document.createElement('div');el.id='__diag';el.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:2147483647;background:#7f1d1d;color:#fff;font:11px/1.4 monospace;padding:8px;white-space:pre-wrap;max-height:50vh;overflow:auto;border-top:2px solid #fff';document.body.appendChild(el);}el.textContent+=m+'\\n\\n';el.scrollTop=el.scrollHeight;}catch(_){}}function fmt(a){try{return (a&&a.message)?a.message:(typeof a==='object'?JSON.stringify(a):String(a));}catch(_){return String(a);}}window.addEventListener('error',function(e){show('ERR: '+((e&&e.message)?e.message:(e&&e.target&&(e.target.src||e.target.href))?'failed to load '+(e.target.src||e.target.href):'unknown')+((e&&e.filename)?' @ '+e.filename+':'+e.lineno:''));},true);window.addEventListener('unhandledrejection',function(e){show('REJECT: '+fmt(e&&e.reason));});var ce=console.error;console.error=function(){try{show('console.error: '+Array.prototype.map.call(arguments,fmt).join(' ').slice(0,400));}catch(_){}return ce.apply(console,arguments);};var cw=console.warn;console.warn=function(){try{var s=Array.prototype.map.call(arguments,fmt).join(' ');if(/hydrat|mismatch|did not match|server|client/i.test(s))show('WARN: '+s.slice(0,400));}catch(_){}return cw.apply(console,arguments);};show('diagnostic active');})();`;

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
        <script dangerouslySetInnerHTML={{ __html: DIAG_SCRIPT }} />
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
