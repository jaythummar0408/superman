import { User, Heart, Download, type LucideIcon } from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: User,
    title: "No Registration Required",
    desc: "No registration required; just open in your favorite browser and start using our tools.",
  },
  {
    icon: Heart,
    title: "Free to use",
    desc: "Our tools are free to use, so you can focus on what really matters. Enjoy our free tools!",
  },
  {
    icon: Download,
    title: "No Installation Required",
    desc: "Our tools are easy to use and accessible on all devices. The Internet and a browser are all you need.",
  },
];

export function WhyUse() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Use Our Tools?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Our tools are designed to make your daily tasks easier and more efficient. Whether you&apos;re a busy
          professional or a student, we&apos;ve got you covered. Our tools are easy to use and accessible on all
          devices, so you can focus on what really matters.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-border/40 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-card"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
