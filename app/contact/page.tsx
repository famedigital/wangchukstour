'use client';

import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Users,
  Mountain,
  Check,
} from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4">Contact Us</Badge>
              <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions about traveling to Bhutan? We're here to help you plan your
                perfect journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Email Us</h3>
                  <a
                    href="mailto:info@wangchuktour.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    info@wangchuktour.com
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Call Us</h3>
                  <a
                    href="tel:+97517111111"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +975 17 111 111
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">Thimphu, Bhutan</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="grid gap-12 lg:grid-cols-2 max-w-5xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">Send Us a Message</h2>
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            className="w-full rounded-lg border bg-background px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Your first name"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            className="w-full rounded-lg border bg-background px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Your last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full rounded-lg border bg-background px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full rounded-lg border bg-background px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          className="w-full rounded-lg border bg-background px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select a topic</option>
                          <option value="tour-inquiry">Tour Inquiry</option>
                          <option value="custom-tour">Custom Tour Request</option>
                          <option value="booking">Booking Question</option>
                          <option value="general">General Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          className="w-full rounded-lg border bg-background px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                          placeholder="Tell us about your travel plans, questions, or feedback..."
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-primary">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-4">Office Hours</h2>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Monday - Friday</span>
                          <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Saturday</span>
                          <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Sunday</span>
                          <span className="text-muted-foreground">Closed</span>
                        </div>
                        <Separator />
                        <p className="text-sm text-muted-foreground">
                          All times are Bhutan Standard Time (BST)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold mb-4">Why Choose Wangchuk Tour?</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Local Expertise</p>
                        <p className="text-sm text-muted-foreground">
                          Bhutanese-owned and operated since 2008
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Personalized Service</p>
                        <p className="text-sm text-muted-foreground">
                          Every tour tailored to your interests
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Sustainable Tourism</p>
                        <p className="text-sm text-muted-foreground">
                          Committed to preserving Bhutan's environment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">24/7 Support</p>
                        <p className="text-sm text-muted-foreground">
                          Always available during your journey
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold mb-4">Quick Links</h2>
                  <div className="space-y-2">
                    <Link href="/tours" className="inline-flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                      Browse Tours
                    </Link>
                    <Link href="/about" className="inline-flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                      Learn About Us
                    </Link>
                    <Link href="/blog" className="inline-flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                      Read Travel Guides
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary to-secondary">
          <div className="container px-4 text-center">
            <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Bhutan Adventure?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
              Browse our collection of carefully crafted tours or reach out to create your custom
                  journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tours"
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-background px-10 py-6 text-lg font-medium text-foreground transition-all hover:bg-background/90"
              >
                Explore Tours
              </Link>
              <Link
                href="mailto:info@wangchuktour.com"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-foreground px-10 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Us Directly
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
