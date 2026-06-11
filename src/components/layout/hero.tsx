export function Hero() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-12">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Notch Tools
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          A free collection of premium developer and design tools.
          <br />
          Crafted to boost your productivity &amp; speed up your workflow.
          <br />
          Updated weekly with new tools &amp; improvements.
        </p>
        <div className="mt-8 h-px w-full bg-border/60" />
      </div>
    </section>
  );
}
