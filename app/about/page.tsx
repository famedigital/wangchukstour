'use client';

import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import {
  Heart,
  Mountain,
  Users,
  Shield,
  Award,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Authentic Experiences',
      description: 'We believe in genuine Bhutanese culture, not tourist traps. Every journey we craft connects you deeply with local traditions, communities, and the spiritual essence of the Land of the Thunder Dragon.',
      gradient: 'from-prayer-red to-monastery-red',
    },
    {
      icon: Shield,
      title: 'Sustainable Tourism',
      description: 'We\'re committed to preserving Bhutan\'s pristine environment and rich cultural heritage. Our practices respect local ecosystems and support the communities that welcome us.',
      gradient: 'from-prayer-green to-primary',
    },
    {
      icon: Users,
      title: 'Personalized Service',
      description: 'Every traveler is unique. We take time to understand your interests, pace, and preferences to create experiences that resonate personally with you.',
      gradient: 'from-prayer-blue to-secondary',
    },
    {
      icon: Mountain,
      title: 'Local Expertise',
      description: 'Born and raised in Bhutan, our team knows every trail, temple, and hidden gem. We share insights only locals can offer, making your journey truly authentic.',
      gradient: 'from-accent to-prayer-yellow',
    },
  ];

  const storyPoints = [
    {
      year: '2008',
      title: 'Our Beginning',
      description: 'Wangchuk Tour was founded with a simple mission: share the magic of Bhutan with the world while preserving its sacred traditions.',
    },
    {
      year: '2012',
      title: 'Growing Recognition',
      description: 'Our commitment to authentic experiences earned us recognition from travelers worldwide, leading to partnerships with prestigious tour operators.',
    },
    {
      year: '2018',
      title: 'Sustainability Focus',
      description: 'We formalized our commitment to sustainable tourism, ensuring every journey we create gives back to local communities.',
    },
    {
      year: 'Today',
      title: 'Trusted by 500+ Travelers',
      description: 'Today, we\'re proud to have guided over 500 travelers through Bhutan, creating memories that last a lifetime.',
    },
  ];

  const team = [
    {
      name: 'Wangchuk Dorji',
      role: 'Founder & Managing Director',
      bio: 'Born in Thimphu, Wangchuk has been guiding travelers through Bhutan for over 15 years. His deep knowledge of Buddhist culture and Himalayan trails ensures every journey is authentic.',
    },
    {
      name: 'Tashi Deki',
      role: 'Operations Manager',
      bio: 'Tashi coordinates every detail of your journey. From permits to accommodations, she ensures everything flows seamlessly.',
    },
    {
      name: 'Karma Wangchuk',
      role: 'Senior Guide',
      bio: 'With expertise in Bhutanese history and Buddhism, Karma brings ancient stories and sacred sites to life.',
    },
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Happy Travelers', color: '#DC143C' },
    { icon: Mountain, value: '15+', label: 'Years Experience', color: '#D4A017' },
    { icon: Sparkles, value: '50+', label: 'Unique Itineraries', color: '#B91C1C' },
    { icon: Award, value: '100%', label: 'Satisfaction Rate', color: '#CD7F32' },
  ];

  const whyBhutan = [
    {
      icon: Mountain,
      title: 'Untouched Nature',
      description: 'Pristine Himalayan landscapes, sacred valleys, and ecosystems preserved for generations.',
    },
    {
      icon: Sparkles,
      title: 'Living Culture',
      description: 'Ancient traditions, vibrant festivals, and Buddhist spirituality woven into daily life.',
    },
    {
      icon: Heart,
      title: 'Gross National Happiness',
      description: 'A unique philosophy prioritizing wellbeing over GDP, creating a society that values contentment.',
    },
    {
      icon: Shield,
      title: 'Sustainable Tourism',
      description: 'High-value, low-impact tourism ensures experiences remain authentic and environments protected.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-monastery-red/20 via-background to-prayer-red/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/10 via-transparent to-transparent" />

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
                  About Us
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8">
                  <span className="bg-clip-text text-transparent" style={{
                    backgroundImage: 'linear-gradient(135deg, #DC143C 0%, #8B0000 50%, #D4A017 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Discover the Wangchuk Tour Story
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  We\'re more than a tour company—we\'re your bridge to authentic Bhutanese
                  experiences, culture, and spiritual journeys.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-16 md:py-24 shadow-lg">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center group">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg" style={{ background: stat.color }}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Our Story</h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  From a passion for sharing Bhutan\'s beauty to a trusted name in Himalayan tourism
                </p>
              </div>
            </ScrollReveal>

            <div className="max-w-5xl mx-auto">
              <ScrollReveal direction="up" delay={0.1}>
                <div className="mb-16 text-center max-w-3xl mx-auto">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                    Wangchuk Tour was born from a deep love for Bhutan and a desire to share its
                    magic with the world. Founded by Wangchuk Dorji, a native Bhutanese with over
                    15 years of experience in tourism, we\'ve grown from a small family operation
                    to a trusted name that travelers worldwide recommend.
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    What sets us apart isn\'t just our knowledge of Bhutan—it\'s our genuine
                    commitment to creating meaningful experiences. Every tour we design balances
                    must-see landmarks with hidden gems, cultural immersion with comfort, and
                    adventure with safety.
                  </p>
                </div>
              </ScrollReveal>

              <StaggerChildren>
                <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                  {storyPoints.map((point, i) => (
                    <Card key={i} className="shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1" style={{ borderColor: 'var(--border)' }}>
                      <CardContent className="p-8">
                        <Badge
                          className="mb-4 px-4 py-2 text-sm font-bold border-0"
                          style={{
                            background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                            color: '#FFFFFF'
                          }}
                        >
                          {point.year}
                        </Badge>
                        <h3 className="font-heading font-bold text-xl mb-3">{point.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">What We Believe</h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Our values guide every journey we create
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {values.map((value, i) => {
                  const Icon = value.icon;
                  return (
                    <Card key={i} className="shadow-lg hover:border-prayer-red transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
                      <CardContent className="p-8 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)` }}>
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="font-heading font-bold text-xl mb-4">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">{value.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Meet Our Team</h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  The passionate people behind every Wangchuk Tour journey
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren>
              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                {team.map((member, i) => (
                  <Card key={i} className="shadow-lg text-center overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="h-64 bg-gradient-to-br flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
                      <Users className="h-24 w-24 text-white/30 relative z-10" />
                    </div>
                    <CardContent className="p-8">
                      <h3 className="font-heading font-bold text-2xl mb-2">{member.name}</h3>
                      <p className="text-sm font-semibold mb-4" style={{ color: 'var(--prayer-red)' }}>
                        {member.role}
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-sm">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Why Bhutan Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <Badge
                  className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  Why Bhutan?
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">The Last Shangri-La</h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Bhutan is more than a destination—it\'s a transformation
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren>
              <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
                {whyBhutan.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Card key={i} className="shadow-lg hover:border-prayer-red transition-all duration-300 group hover:shadow-xl hover:-translate-y-1">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg" style={{ background: `linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)` }}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-bold text-xl mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-monastery-red via-prayer-red to-crimson" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,160,23,0.2)_0%,_transparent_50%)]" />

          <div className="relative container text-center">
            <ScrollReveal>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Your Bhutan Journey With Us
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                Let Wangchuk Tour be your guide to the magic of Bhutan. Get in touch today to
                start planning your transformative journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact">
                  <MagneticButton
                    className="rounded-xl px-10 py-6 text-lg font-semibold"
                    style={{
                      background: '#FFFFFF',
                      color: 'var(--prayer-red)',
                      border: 'none'
                    }}
                  >
                    Get in Touch
                    <ArrowRight className="w-5 h-5" />
                  </MagneticButton>
                </Link>
                <Link href="/tours">
                  <MagneticButton
                    className="rounded-xl px-10 py-6 text-lg font-semibold shadow-lg"
                    style={{
                      background: 'transparent',
                      color: '#FFFFFF',
                      borderColor: '#FFFFFF'
                    }}
                  >
                    Explore Our Tours
                    <ArrowRight className="w-5 h-5" />
                  </MagneticButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-20 bg-background border-t">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-12">Get in Touch</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg" style={{ background: `linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)` }}>
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold mb-1 text-lg">Address</p>
                    <p className="text-muted-foreground">Thimphu, Bhutan</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg" style={{ background: `linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)` }}>
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold mb-1 text-lg">Email</p>
                    <a
                      href="mailto:info@wangchuktour.com"
                      className="text-muted-foreground hover:text-prayer-red transition-colors"
                    >
                      info@wangchuktour.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg" style={{ background: `linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)` }}>
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold mb-1 text-lg">Phone</p>
                    <a
                      href="tel:+97517111111"
                      className="text-muted-foreground hover:text-prayer-red transition-colors"
                    >
                      +975 17 111 111
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
