import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | Notch Tools",
  description: "Get in touch with the Notch Tools team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Have a question, feedback, or a feature request? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Get in touch</h2>
            <p className="mt-3 text-muted-foreground">
              Our team is always looking to improve Notch Tools. Whether you found a bug or want to suggest a new tool, drop us a message.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">hello@notchtools.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Twitter / X</p>
                <p className="text-sm text-muted-foreground">@NotchTools</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">Remote worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm sm:p-8">
          <form className="space-y-6" action="#">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                  First name
                </label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="John"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                  Last name
                </label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Doe"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                Message
              </label>
              <textarea
                id="message"
                placeholder="How can we help you?"
                rows={5}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y"
              ></textarea>
            </div>

            <Button type="button" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
