'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';

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
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading About page...</p>
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
            <p className="mb-4 text-destructive">{error || 'Failed to load content'}</p>
            <Button onClick={fetchAboutContent}>Try Again</Button>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-24">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-3xl text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                  About us
                </p>
                <h1 className="font-accent mb-6 text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
                  {hero?.title || 'Discover the Last Shangri-La'}
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
                  {hero?.subtitle || 'Experience authentic Bhutanese culture and breathtaking Himalayan landscapes'}
                </p>
                {hero?.cta && (
                  <Link
                    href={hero.cta.link || '/tours'}
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'inline-flex gap-2 bg-white text-primary hover:bg-white/90'
                    )}
                  >
                    {hero.cta.text || 'Explore Our Tours'}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <ScrollReveal>
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Our story
                </p>
                <h2 className="font-accent mb-6 text-2xl font-medium md:text-3xl">
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
          <section className="bg-muted/30 py-20 md:py-28">
            <div className="container">
              <ScrollReveal>
                <div className="mx-auto mb-12 max-w-3xl text-center">
                  <h2 className="font-accent mb-4 text-2xl font-medium md:text-3xl">Our core values</h2>
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
                        <Card className="border-border text-center shadow-none transition-shadow hover:shadow-sm">
                          <CardContent className="p-6">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                              <IconComponent className="h-8 w-8 text-primary" />
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
          <section className="py-20 md:py-28">
            <div className="container">
              <StaggerChildren>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {statistics.map((stat: any, index: number) => (
                    <ScrollReveal key={index} delay={index * 100}>
                      <div className="text-center">
                        <div className="mb-2">
                          <span className="font-accent text-4xl font-medium text-primary md:text-5xl">
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
          <section className="bg-muted/30 py-20 md:py-28">
            <div className="container">
              <ScrollReveal>
                <div className="mx-auto mb-12 max-w-3xl text-center">
                  <h2 className="font-accent mb-4 text-2xl font-medium md:text-3xl">Our journey</h2>
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
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
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
          <section className="py-20 md:py-28">
            <div className="container">
              <ScrollReveal>
                <div className="mx-auto mb-12 max-w-3xl text-center">
                  <h2 className="font-accent mb-4 text-2xl font-medium md:text-3xl">Meet our team</h2>
                  <p className="text-lg text-muted-foreground">
                    The passionate people behind your journeys
                  </p>
                </div>
              </ScrollReveal>

              <StaggerChildren>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {team.map((member: any, index: number) => (
                    <ScrollReveal key={index} delay={index * 100}>
                      <Card className="border-border shadow-none transition-shadow hover:shadow-sm">
                        <CardContent className="p-6 text-center">
                          <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                            {member.image ? (
                              <Image
                                src={optimizeImageUrl(member.image, 400, 400)}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Users className="h-16 w-16 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h3 className="mb-1 font-heading text-xl font-semibold">{member.name}</h3>
                          <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                          <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
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