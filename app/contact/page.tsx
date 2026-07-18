import { Suspense } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/components/contact/ContactForm';
import {
  Mail,
  Phone,
  MapPin,
  Users,
  Mountain,
  ArrowRight,
  MessageCircle,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const contactInfo = {
  email: 'info@wangchuktour.com',
  phone: '+975 17 00 00 00',
  address: 'Thimphu, Bhutan',
  officeHours: 'Mon–Fri, 9:00 AM – 6:00 PM',
  responseTime: 'We reply within 24 hours',
};

const contactItems = [
  {
    icon: Mail,
    title: 'Email',
    detail: contactInfo.email,
    note: contactInfo.responseTime,
  },
  {
    icon: Phone,
    title: 'Phone',
    detail: contactInfo.phone,
    note: contactInfo.officeHours,
  },
  {
    icon: MapPin,
    title: 'Office',
    detail: contactInfo.address,
    note: 'Thimphu, Bhutan',
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation forceSolid />

      <main className="safe-bottom-padding flex-1 pt-16 pb-4 xl:pt-[4.5rem] lg:pb-0">
        {/* Compact intro — form first on mobile */}
        <section className="border-b border-border bg-muted/30">
          <div className="container py-10 md:py-14">
            <p className="mb-2 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Contact
            </p>
            <h1 className="font-accent mb-3 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              Start your Bhutan journey
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Tell us what you&apos;re looking for — we&apos;ll help plan temples, treks, and festivals
              with a local team based in Thimphu.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
              {/* Form first on mobile so Book/Inquire lands on the message */}
              <div className="order-1 lg:order-2 lg:col-span-3">
                <Card
                  id="contact-form"
                  className="scroll-mt-24 border-border shadow-sm lg:scroll-mt-28"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-6">
                      <h2 className="font-heading mb-1 text-xl font-semibold md:text-2xl">
                        Send a message
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Booking requests and inquiries usually get a reply within 24 hours.
                      </p>
                    </div>
                    <Suspense
                      fallback={
                        <div className="py-10 text-center text-sm text-muted-foreground">
                          Loading form…
                        </div>
                      }
                    >
                      <ContactForm />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>

              <aside className="order-2 space-y-6 lg:order-1 lg:col-span-2">
                <div>
                  <h2 className="font-heading mb-4 text-lg font-semibold">Get in touch</h2>
                  <ul className="space-y-4">
                    {contactItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.title} className="flex gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="size-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-foreground">{item.detail}</p>
                            <p className="text-sm text-muted-foreground">{item.note}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-heading mb-3 text-sm font-semibold">Why travelers choose us</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      { icon: Users, text: 'Bhutanese-owned team with 15+ years experience' },
                      { icon: Mountain, text: 'Authentic cultural itineraries' },
                      { icon: Compass, text: 'Personalized routes, not packages off a shelf' },
                      { icon: MessageCircle, text: 'Support before and during your trip' },
                    ].map((item) => (
                      <li key={item.text} className="flex items-start gap-2.5">
                        <item.icon className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40 py-14 md:py-20">
          <div className="container">
            <h2 className="font-accent mb-8 text-2xl font-medium md:text-3xl">Quick answers</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  q: 'Do I need a visa for Bhutan?',
                  a: 'Most international visitors need a visa. We can arrange it as part of your tour.',
                },
                {
                  q: 'When is the best time to visit?',
                  a: 'Spring (Mar–May) and autumn (Sep–Nov) are clearest; each season has its own character.',
                },
                {
                  q: 'How much does a trip cost?',
                  a: 'Pricing depends on season, group size, and itinerary. Send a short brief for a quote.',
                },
                {
                  q: 'Is Bhutan safe for travelers?',
                  a: 'Yes — Bhutan is widely regarded as one of the safest destinations in the region.',
                },
              ].map((faq) => (
                <Card key={faq.q} className="border-border shadow-none">
                  <CardContent className="p-5">
                    <h3 className="font-heading mb-2 font-semibold">{faq.q}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border py-14 md:py-16">
          <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-heading mb-2 text-xl font-semibold md:text-2xl">
                Prefer to browse first?
              </h2>
              <p className="text-muted-foreground">Explore tours, then come back when you&apos;re ready.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/tours" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
                Browse tours
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://wa.me/97517643416"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
