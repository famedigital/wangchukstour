'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { Loader2 } from 'lucide-react';
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
import Image from 'next/image';

const iconMap = {
  Heart, Mountain, Users, Shield, Award, Sparkles, Mail, Phone, MapPin
};

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=about');
      const data = await response.json();

      if (response.ok) {
        setContent(data.content);
      } else {
        throw new Error('Failed to load content');
      }
    } catch (err) {
      console.error('Error fetching About content:', err);
      setError('Failed to load About page content');
    } finally {
      setLoading(false);
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

  const getIcon = (iconName: string) => {
    return (iconMap as any)[iconName] || Heart;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-prayer-red animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading About page...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Failed to load content'}</p>
            <button
              onClick={fetchAboutContent}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-lg font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { hero, story, values, statistics, timeline, team } = content;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={optimizeImageUrl(hero?.backgroundImage || 'https://res.cloudinary.com/hckgrdeh/image/upload/v1782911267/tigernest_paro_wdenqu.jpg', 1920, 1080)}
              alt={hero?.title || 'About Us'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/20 via-transparent to-transparent" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-20">
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
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 text-white">
                  {hero?.title || 'Discover the Last Shangri-La'}
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
                  {hero?.subtitle || 'Experience authentic Bhutanese culture and breathtaking Himalayan landscapes'}
                </p>
                {hero?.cta && (
                  <Link href={hero.cta.link || '/tours'}>
                    <MagneticButton
                      className="rounded-xl px-10 py-6 text-lg font-semibold"
                      style={{
                        background: '#FFFFFF',
                        color: 'var(--prayer-red)',
                        border: 'none'
                      }}
                    >
                      {hero.cta.text || 'Explore Our Tours'}
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <ScrollReveal>
              <div className="mx-auto max-w-3xl text-center mb-12">
                <Badge
                  className="mb-3 px-4 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  Our Story
                </Badge>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
                  {story?.title || 'Our Journey'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {story?.content || 'Wangchuk Tours & Treks is your gateway to experiencing the authentic beauty of Bhutan.'}
                </p>
                {story?.founded && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Founded in {story.founded}
                  </p>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Values Section */}
        {values && values.length > 0 && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container">
              <ScrollReveal>
                <div className="mx-auto max-w-3xl text-center mb-12">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                    Our Core Values
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    The principles that guide every journey we create
                  </p>
                </div>
              </ScrollReveal>

              <StaggerChildren>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {values.map((value: any, index: number) => {
                    const IconComponent = getIcon(value.icon);
                    return (
                      <ScrollReveal key={index} delay={index * 100}>
                        <Card className="text-center hover:shadow-premium-lg transition-all duration-300 group-hover:-translate-y-2">
                          <CardContent className="p-6">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                              style={{
                                background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)'
                              }}
                            >
                              <IconComponent className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-heading font-bold text-xl mb-3">
                              {value.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {value.description}
                            </p>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </StaggerChildren>
            </div>
          </section>
        )}

        {/* Statistics Section */}
        {statistics && statistics.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <StaggerChildren>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {statistics.map((stat: any, index: number) => (
                    <ScrollReveal key={index} delay={index * 100}>
                      <div className="text-center">
                        <div className="mb-2">
                          <span className="font-heading text-4xl md:text-5xl font-bold"
                            style={{ color: 'var(--prayer-red)' }}
                          >
                            {stat.number}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-lg font-medium">
                          {stat.label}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </StaggerChildren>
            </div>
          </section>
        )}

        {/* Timeline Section */}
        {timeline && timeline.length > 0 && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container">
              <ScrollReveal>
                <div className="mx-auto max-w-3xl text-center mb-12">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                    Our Journey
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Key milestones in our story
                  </p>
                </div>
              </ScrollReveal>

              <div className="mx-auto max-w-3xl">
                <div className="space-y-8">
                  {timeline.map((event: any, index: number) => (
                    <ScrollReveal key={index} delay={index * 100}>
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                            style={{
                              background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)'
                            }}
                          >
                            {event.year}
                          </div>
                        </div>
                        <div className="flex-1 pb-8 border-l-2 border-muted last:pb-0 last:border-0 pl-6">
                          <h3 className="font-heading font-bold text-xl mb-2">
                            {event.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Team Section */}
        {team && team.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <ScrollReveal>
                <div className="mx-auto max-w-3xl text-center mb-12">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                    Meet Our Team
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    The passionate people behind your journeys
                  </p>
                </div>
              </ScrollReveal>

              <StaggerChildren>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {team.map((member: any, index: number) => (
                    <ScrollReveal key={index} delay={index * 100}>
                      <Card className="hover:shadow-premium-lg transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                            {member.image ? (
                              <Image
                                src={optimizeImageUrl(member.image, 400, 400)}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Users className="h-16 w-16 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-heading font-bold text-xl mb-1">
                            {member.name}
                          </h3>
                          <p className="text-sm font-medium mb-3" style={{ color: 'var(--prayer-red)' }}>
                            {member.role}
                          </p>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {member.bio}
                          </p>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  ))}
                </div>
              </StaggerChildren>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}