export const metadata = {
  title: "Privacy Policy | Notch Tools",
  description: "Read our privacy policy to understand how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: October 24, 2023
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Notch Tools, your privacy is our priority. We are committed to protecting your personal information and your right to privacy. This privacy policy explains what information we collect, how we use it, and what rights you have in relation to it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Client-Side Processing</h2>
            <p className="text-muted-foreground leading-relaxed">
              The vast majority of our tools execute <strong>entirely within your browser</strong> (client-side processing). This means that when you format JSON, encode Base64, or resize an image, your data <strong>never leaves your device</strong> and is never sent to our servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We only collect information that is strictly necessary to maintain the basic functionality and security of our website:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Analytics Data:</strong> We may use basic, privacy-friendly analytics tools to see which tools are most popular, helping us prioritize future development. This data is anonymized.</li>
              <li><strong>Contact Information:</strong> If you use our contact form, we collect your name, email address, and message solely for the purpose of responding to your inquiry.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use minimal cookies. The only cookies we currently set are for saving your preferences, such as your dark/light theme choice. We do not use tracking cookies for advertising.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions or comments about this policy, you may email us at privacy@notchtools.com or visit our <a href="/contact" className="text-primary underline underline-offset-4">Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
