import { Suspense } from 'react';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { ContactForm } from '@/components/contact/ContactForm';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Mountain,
  ArrowRight,
  MessageCircle,
  Compass,
} from 'lucide-react';

// Static contact page content (could be fetched from database if dynamic)
const contactContent = {
  hero: {
    title: "Start Your Bhutan Journey",
    subtitle: "Get in touch with our travel experts",
    description: "Whether you're dreaming of mountain temples, cultural festivals, or spiritual journeys, we're here to help make your Bhutan experience unforgettable."
  },
  contactInfo: {
    email: "info@wangchuktour.com",
    phone: "+975 17 00 00 00",
    address: "Thimphu, Bhutan",
    officeHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    responseTime: "We respond within 24 hours"
  }
};

const optimizeImageUrl = (url: string, width: number, height: number) => {
  if (!url) return '';
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911267/tigernest_paro_wdenqu.jpg', 1920, 1080)}
              alt="Tiger's Nest Monastery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/20 via-transparent to-transparent" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-20">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-4xl text-center">
                <Badge
                  className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  Contact
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 text-white">
                  {contactContent.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
                  {contactContent.hero.description}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Information */}
              <ScrollReveal>
                <div className="space-y-8">
                  <div>
                    <Badge
                      className="mb-3 px-4 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                      style={{
                        background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      Get in Touch
                    </Badge>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                      Let's Plan Your Journey
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Have questions about traveling to Bhutan? Our team of local experts is ready to help you create your perfect Himalayan adventure.
                    </p>
                  </div>

                  {/* Contact Cards */}
                  <StaggerChildren className="space-y-6">
                    <ScrollReveal>
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                              <Mail className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg mb-1">Email Us</h3>
                              <p className="text-muted-foreground">{contactContent.contactInfo.email}</p>
                              <p className="text-sm text-muted-foreground mt-1">{contactContent.contactInfo.responseTime}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>

                    <ScrollReveal>
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)' }}>
                              <Phone className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg mb-1">Call Us</h3>
                              <p className="text-muted-foreground">{contactContent.contactInfo.phone}</p>
                              <p className="text-sm text-muted-foreground mt-1">{contactContent.contactInfo.officeHours}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>

                    <ScrollReveal>
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #B91C1C 0%, #8B0000 100%)' }}>
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                              <p className="text-muted-foreground">{contactContent.contactInfo.address}</p>
                              <p className="text-sm text-muted-foreground mt-1">Located in the heart of Thimphu</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  </StaggerChildren>

                  {/* Why Choose Us */}
                  <div className="pt-6">
                    <h3 className="font-bold text-xl mb-4">Why Choose Wangchuk Tour?</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Users, text: 'Local Bhutanese experts with 15+ years experience' },
                        { icon: Mountain, text: 'Authentic cultural experiences' },
                        { icon: Compass, text: 'Personalized itineraries tailored to you' },
                        { icon: MessageCircle, text: '24/7 support during your journey' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <item.icon className="h-5 w-5 text-prayer-red mt-0.5 shrink-0" />
                          <p className="text-muted-foreground">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact Form */}
              <ScrollReveal direction="up">
                <div>
                  <Card className="border-0 shadow-xl">
                    <CardContent className="p-8">
                      <div className="mb-6">
                        <h3 className="font-heading text-2xl font-bold mb-2">Send Us a Message</h3>
                        <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
                      </div>

                      <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading form...</div>}>
                        <ContactForm />
                      </Suspense>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <ScrollReveal>
              <div className="text-center mb-12">
                <Badge
                  className="mb-3 px-4 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  FAQ
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {[
                {
                  q: "Do I need a visa to visit Bhutan?",
                  a: "Yes, all international tourists (except Indians, Bangladeshis, and Maldivians) need a visa to enter Bhutan. We can help arrange your visa as part of your tour package."
                },
                {
                  q: "What's the best time to visit Bhutan?",
                  a: "Spring (March-May) and autumn (September-November) offer the best weather with clear skies and comfortable temperatures. However, each season has its own unique charm."
                },
                {
                  q: "How much does a trip to Bhutan cost?",
                  a: "Bhutan has a daily tariff system that includes accommodation, meals, transport, and guide services. Contact us for a personalized quote based on your travel preferences."
                },
                {
                  q: "Is Bhutan safe for tourists?",
                  a: "Bhutan is considered one of the safest destinations in the world. Crime rates are very low, and the people are known for their warmth and hospitality towards visitors."
                }
              ].map((faq, index) => (
                <ScrollReveal key={index}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-3">{faq.q}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911256/buddhapoint_z2kucc.jpg', 1920, 1080)}
              alt="Buddha Point, Thimphu"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent" />
          </div>

          <div className="relative container">
            <ScrollReveal>
              <div className="max-w-2xl">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Start Your Bhutan Adventure?
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Let us help you create memories that will last a lifetime in the Land of the Thunder Dragon.
                </p>
                <div className="flex flex-wrap gap-4">
                  <MagneticButton>
                    <a
                      href="#contact-form"
                      className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </MagneticButton>
                  <MagneticButton>
                    <a
                      href="/tours"
                      className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border-2 border-white/30 hover:border-white/50"
                    >
                      Browse Tours
                    </a>
                  </MagneticButton>
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