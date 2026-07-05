'use client';

import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Users,
  Mountain,
  Check,
  ArrowRight,
} from 'lucide-react';

const optimizeImageUrl = (url: string, width: number, height: number) => {
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    alert('Thank you for your message! We will get back to you soon.');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'info@wangchuktour.com',
      link: 'mailto:info@wangchuktour.com',
      color: '#DC143C',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+975 17643416',
      link: 'tel:+97517643416',
      color: '#D4A017',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Thimphu, Bhutan',
      link: null,
      color: '#B91C1C',
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Bhutanese-owned and operated since 2008',
    },
    {
      icon: Mountain,
      title: 'Personalized Service',
      description: 'Every tour tailored to your interests',
    },
    {
      icon: Check,
      title: 'Sustainable Tourism',
      description: 'Committed to preserving Bhutan\'s environment',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always available during your journey',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911338/paro-rimpungdzong_uemj9o.jpg', 1920, 1080)}
              alt="Paro Dzong"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/20 via-transparent to-transparent" />
          </div>

          <div className="relative container pt-32 pb-20 md:pt-40 md:pb-28">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-3xl text-center">
                <Badge
                  className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  Contact Us
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 text-white">
                  Get in Touch
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                  Have questions about traveling to Bhutan? We're here to help you plan your
                  perfect journey to the Land of the Thunder Dragon.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 md:py-24 shadow-lg">
          <div className="container">
            <StaggerChildren>
              <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <Card key={i} className="shadow-lg text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                      <CardContent className="p-8">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: info.color }}>
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-3">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-muted-foreground hover:text-prayer-red transition-colors font-medium text-lg"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground font-medium text-lg">{info.value}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
              {/* Contact Form */}
              <ScrollReveal direction="right">
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Send Us a Message</h2>
                  <Card className="shadow-lg shadow-lg">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-semibold mb-3">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              required
                              className="w-full rounded-xl shadow-lg bg-background px-5 py-3 outline-none focus:border-prayer-red focus:ring-2 focus:ring-prayer-red/20 transition-all"
                              placeholder="Your first name"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-semibold mb-3">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              required
                              className="w-full rounded-xl shadow-lg bg-background px-5 py-3 outline-none focus:border-prayer-red focus:ring-2 focus:ring-prayer-red/20 transition-all"
                              placeholder="Your last name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold mb-3">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full rounded-xl shadow-lg bg-background px-5 py-3 outline-none focus:border-prayer-red focus:ring-2 focus:ring-prayer-red/20 transition-all"
                            placeholder="your.email@example.com"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold mb-3">
                            Phone Number (Optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full rounded-xl shadow-lg bg-background px-5 py-3 outline-none focus:border-prayer-red focus:ring-2 focus:ring-prayer-red/20 transition-all"
                            placeholder="+1 234 567 8900"
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-semibold mb-3">
                            Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            className="w-full rounded-xl shadow-lg bg-background px-5 py-3 outline-none focus:border-prayer-red focus:ring-2 focus:ring-prayer-red/20 transition-all"
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
                          <label htmlFor="message" className="block text-sm font-semibold mb-3">
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            required
                            rows={6}
                            className="w-full rounded-xl shadow-lg bg-background px-5 py-3 outline-none focus:border-prayer-red focus:ring-2 focus:ring-prayer-red/20 resize-none transition-all"
                            placeholder="Tell us about your travel plans, questions, or feedback..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                          style={{
                            background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                            border: 'none'
                          }}
                        >
                          <span className="inline-flex items-center justify-center gap-2">
                            Send Message
                            <Send className="w-5 h-5" />
                          </span>
                        </button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              {/* Info */}
              <ScrollReveal direction="left" delay={0.2}>
                <div className="space-y-10">
                  {/* Office Hours */}
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Office Hours</h2>
                    <Card className="shadow-lg">
                      <CardContent className="p-8">
                        <div className="space-y-5">
                          <div className="flex items-center justify-between py-2 shadow-lg shadow-lg/50">
                            <span className="font-semibold text-lg">Monday - Friday</span>
                            <span className="text-muted-foreground font-medium">9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2 shadow-lg shadow-lg/50">
                            <span className="font-semibold text-lg">Saturday</span>
                            <span className="text-muted-foreground font-medium">10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="font-semibold text-lg">Sunday</span>
                            <span className="text-muted-foreground font-medium">Closed</span>
                          </div>
                          <p className="text-sm text-muted-foreground pt-4">
                            All times are Bhutan Standard Time (BST)
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Why Choose Wangchuks Tour?</h2>
                    <div className="space-y-5">
                      {benefits.map((benefit, i) => {
                        const Icon = benefit.icon;
                        return (
                          <div key={i} className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-lg mb-1">{benefit.title}</p>
                              <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Quick Links</h2>
                    <div className="space-y-3">
                      <Link href="/tours" className="inline-flex w-full items-center justify-between rounded-xl px-5 py-4 font-medium hover:bg-muted transition-colors shadow-lg border-transparent hover:shadow-lg">
                        <span>Browse Tours</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link href="/about" className="inline-flex w-full items-center justify-between rounded-xl px-5 py-4 font-medium hover:bg-muted transition-colors shadow-lg border-transparent hover:shadow-lg">
                        <span>Learn About Us</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link href="/blog" className="inline-flex w-full items-center justify-between rounded-xl px-5 py-4 font-medium hover:bg-muted transition-colors shadow-lg border-transparent hover:shadow-lg">
                        <span>Read Travel Guides</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911270/bumthang_bdxytr.jpg', 1920, 1080)}
              alt="Bumthang"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/85" />
          </div>

          <div className="relative container text-center">
            <ScrollReveal>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Start Your Bhutan Adventure?
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                Browse our collection of carefully crafted tours or reach out to create your custom
                journey through the Last Shangri-La.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/tours">
                  <MagneticButton
                    className="rounded-xl px-10 py-6 text-lg font-semibold"
                    style={{
                      background: '#FFFFFF',
                      color: 'var(--prayer-red)',
                      border: 'none'
                    }}
                  >
                    Explore Tours
                    <ArrowRight className="w-5 h-5" />
                  </MagneticButton>
                </Link>
                <Link href="mailto:info@wangchuktour.com">
                  <MagneticButton
                    className="rounded-xl px-10 py-6 text-lg font-semibold shadow-lg"
                    style={{
                      background: 'transparent',
                      color: '#FFFFFF',
                      borderColor: '#FFFFFF'
                    }}
                  >
                    Email Us Directly
                    <Mail className="w-5 h-5" />
                  </MagneticButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
