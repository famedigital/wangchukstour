import { Suspense } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
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

const contactContent = {
  hero: {
    title: 'Start Your Bhutan Journey',
    subtitle: 'Get in touch with our travel experts',
    description:
      "Whether you're dreaming of mountain temples, cultural festivals, or spiritual journeys, we're here to help make your Bhutan experience unforgettable.",
  },
  contactInfo: {
    email: 'info@wangchuktour.com',
    phone: '+975 17 00 00 00',
    address: 'Thimphu, Bhutan',
    officeHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    responseTime: 'We respond within 24 hours',
  },
};

const optimizeImageUrl = (url: string, width: number, height: number) => {
  if (!url) return '';
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

const contactItems = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: contactContent.contactInfo.email,
    note: contactContent.contactInfo.responseTime,
  },
  {
    icon: Phone,
    title: 'Call Us',
    detail: contactContent.contactInfo.phone,
    note: contactContent.contactInfo.officeHours,
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    detail: contactContent.contactInfo.address,
    note: 'Located in the heart of Thimphu',
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl(
                'https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911267/tigernest_paro_wdenqu.jpg',
                1920,
                1080
              )}
              alt="Tiger's Nest Monastery"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-24">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-3xl">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                  Contact
                </p>
                <h1 className="font-accent mb-6 text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
                  {contactContent.hero.title}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-white/85">
                  {contactContent.hero.description}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
              <ScrollReveal>
                <div className="space-y-10">
                  <div>
                    <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Get in touch
                    </p>
                    <h2 className="font-accent mb-4 text-3xl font-medium md:text-4xl">
                      Let&apos;s plan your journey
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      Have questions about traveling to Bhutan? Our team of local experts is ready to
                      help you create your perfect Himalayan adventure.
                    </p>
                  </div>

                  <StaggerChildren className="space-y-4">
                    {contactItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <ScrollReveal key={item.title}>
                          <Card className="border-border shadow-none">
                            <CardContent className="flex gap-4 p-6">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="mb-1 font-heading font-semibold">{item.title}</h3>
                                <p className="text-foreground">{item.detail}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </ScrollReveal>
                      );
                    })}
                  </StaggerChildren>

                  <div className="border-t border-border pt-8">
                    <h3 className="mb-4 font-heading text-lg font-semibold">Why choose us</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Users, text: 'Local Bhutanese experts with 15+ years experience' },
                        { icon: Mountain, text: 'Authentic cultural experiences' },
                        { icon: Compass, text: 'Personalized itineraries tailored to you' },
                        { icon: MessageCircle, text: '24/7 support during your journey' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                          <p className="text-muted-foreground">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up">
                <Card className="border-border shadow-sm" id="contact-form">
                  <CardContent className="p-8 md:p-10">
                    <div className="mb-8">
                      <h3 className="font-accent mb-2 text-2xl font-medium">Send us a message</h3>
                      <p className="text-muted-foreground">
                        Fill out the form below and we&apos;ll get back to you within 24 hours.
                      </p>
                    </div>

                    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading form...</div>}>
                      <ContactForm />
                    </Suspense>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40 py-20 md:py-28">
          <div className="container">
            <ScrollReveal>
              <div className="mb-12 max-w-2xl">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  FAQ
                </p>
                <h2 className="font-accent text-3xl font-medium md:text-4xl">Frequently asked questions</h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {[
                {
                  q: 'Do I need a visa to visit Bhutan?',
                  a: 'Yes, all international tourists (except Indians, Bangladeshis, and Maldivians) need a visa to enter Bhutan. We can help arrange your visa as part of your tour package.',
                },
                {
                  q: "What's the best time to visit Bhutan?",
                  a: 'Spring (March-May) and autumn (September-November) offer the best weather with clear skies and comfortable temperatures. However, each season has its own unique charm.',
                },
                {
                  q: 'How much does a trip to Bhutan cost?',
                  a: 'Bhutan has a daily tariff system that includes accommodation, meals, transport, and guide services. Contact us for a personalized quote based on your travel preferences.',
                },
                {
                  q: 'Is Bhutan safe for tourists?',
                  a: 'Bhutan is considered one of the safest destinations in the world. Crime rates are very low, and the people are known for their warmth and hospitality towards visitors.',
                },
              ].map((faq, index) => (
                <ScrollReveal key={index}>
                  <Card className="h-full border-border shadow-none">
                    <CardContent className="p-6">
                      <h3 className="mb-3 font-heading font-semibold">{faq.q}</h3>
                      <p className="leading-relaxed text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </StaggerChildren>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl(
                'https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911256/buddhapoint_z2kucc.jpg',
                1920,
                1080
              )}
              alt="Buddha Point, Thimphu"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          </div>

          <div className="relative container">
            <ScrollReveal>
              <div className="max-w-2xl">
                <h2 className="font-accent mb-5 text-3xl font-medium text-white md:text-4xl">
                  Ready to start your Bhutan adventure?
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-white/85">
                  Let us help you create memories that will last a lifetime in the Land of the Thunder Dragon.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="#contact-form" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
                    Get Started
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/tours"
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'lg' }),
                      'border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white'
                    )}
                  >
                    Browse Tours
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
