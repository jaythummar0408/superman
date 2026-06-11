export const metadata = {
  title: "About Us | Notch Tools",
  description: "Learn more about Notch Tools and our mission to provide the best free online tools.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About Notch Tools
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We build beautiful, fast, and completely free online tools for developers, designers, and everyday users.
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Notch Tools, our mission is to simplify your digital workflow. We noticed that many online tool websites are cluttered with ads, have poor user interfaces, or put essential features behind paywalls. We wanted to create a platform that respects your time and your data—offering premium-quality tools completely for free.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What We Offer</h2>
            <p className="text-muted-foreground leading-relaxed">
              We offer over 100+ utilities across various categories:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Developer Tools:</strong> JSON formatters, JWT decoders, and Regex testers to speed up your coding.</li>
              <li><strong>Image Tools:</strong> Compressors, converters, and resizers that run quickly directly in your browser.</li>
              <li><strong>CSS Tools:</strong> Generators for gradients, shadows, and flexbox layouts to perfect your web designs.</li>
              <li><strong>Security & Utilities:</strong> Password generators, hash checkers, and everyday calculators.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Privacy First</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe your data is yours. The vast majority of our tools process data locally directly in your web browser. This means your files, images, and sensitive data (like passwords or JWTs) never even touch our servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              Have a tool request or found a bug? We'd love to hear from you. Head over to our <a href="/contact" className="text-primary underline underline-offset-4 hover:text-primary/80">Contact Page</a> to get in touch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
