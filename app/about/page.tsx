import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAboutPageContent } from '@/lib/content/get-about';
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
  Compass,
  Star,
  Globe,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { getCompanyName } from '@/lib/brand';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyName();
  return {
    title: `About Us | ${company}`,
    description:
      'Learn about our story, values, milestones, and the Bhutanese team behind authentic Himalayan journeys.',
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Mountain,
  Users,
  Shield,
  Award,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Compass,
  Star,
  Globe,
  Leaf,
};

const valueIcons = [Heart, Shield, Users, Mountain, Award, Sparkles];

function optimizeImageUrl(url: string, width: number, height: number) {
  if (!url) return '';
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
}

function getIcon(iconName?: string, index = 0) {
  if (iconName && iconMap[iconName]) return iconMap[iconName];
  return valueIcons[index % valueIcons.length];
}

export default async function AboutPage() {
  const content = await getAboutPageContent();
  const { hero, story, values, statistics, timeline, team } = content;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation forceSolid />

      <main className="safe-bottom-padding flex-1 pt-16 pb-4 xl:pt-[4.5rem] lg:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizeImageUrl(hero.backgroundImage, 1920, 900)}
              alt={hero.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/35" />
          </div>

          <div className="relative container py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-medium tracking-[0.2em] text-white/70 uppercase">
                About us
              </p>
              <h1 className="font-accent mb-5 text-4xl font-medium tracking-tight text-white md:text-5xl">
                {hero.title}
              </h1>
              {hero.subtitle && (
                <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed whitespace-pre-line text-white/85 md:text-lg">
                  {hero.subtitle}
                </p>
              )}
              {hero.cta?.text && (
                <Link
                  href={hero.cta.link || '/tours'}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'inline-flex gap-2 bg-white text-primary hover:bg-white/90'
                  )}
                >
                  {hero.cta.text}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Story */}
        <section id="story" className="scroll-mt-24 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Our story
              </p>
              <h2 className="font-accent mb-5 text-2xl font-medium md:text-3xl">{story.title}</h2>
              <p className="text-left text-base leading-relaxed whitespace-pre-line text-muted-foreground md:text-center md:text-lg">
                {story.content}
              </p>
              {story.founded && (
                <p className="mt-6 inline-flex rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-foreground">
                  Founded in {story.founded}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Values */}
        {values.length > 0 && (
          <section className="border-y border-border bg-muted/30 py-16 md:py-24">
            <div className="container">
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="font-accent mb-3 text-2xl font-medium md:text-3xl">Our values</h2>
                <p className="text-muted-foreground">What guides every journey we craft</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                {values.map((value, index) => {
                  const IconComponent = getIcon(value.icon, index);
                  return (
                    <Card key={`${value.title}-${index}`} className="border-border text-center shadow-none">
                      <CardContent className="p-4 sm:p-6">
                        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 sm:mb-4 sm:size-12">
                          <IconComponent className="size-5 text-primary sm:size-6" />
                        </div>
                        <h3 className="font-heading mb-2 text-sm font-semibold sm:text-base">
                          {value.title}
                        </h3>
                        {value.description && (
                          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {value.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Statistics */}
        {statistics.length > 0 && (
          <section className="py-14 md:py-20">
            <div className="container grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {statistics.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="text-center">
                  <span className="font-accent text-3xl font-medium text-primary md:text-5xl">
                    {stat.number}
                  </span>
                  <p className="mt-2 text-sm text-muted-foreground md:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <section className="border-t border-border bg-muted/30 py-16 md:py-24">
            <div className="container">
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="font-accent mb-3 text-2xl font-medium md:text-3xl">Our journey</h2>
                <p className="text-muted-foreground">Key milestones along the way</p>
              </div>
              <div className="relative mx-auto max-w-2xl">
                <div className="absolute top-3 bottom-3 left-[1.35rem] w-px bg-border md:left-6" />
                <div className="space-y-8">
                  {timeline.map((event, index) => (
                    <div key={`${event.year}-${index}`} className="relative flex gap-4 md:gap-5">
                      <div className="relative z-10 flex min-w-12 shrink-0 items-center justify-center rounded-full bg-primary px-2 py-2 text-center text-[10px] font-semibold text-primary-foreground md:min-w-14 md:text-xs">
                        {event.year}
                      </div>
                      <div className="flex-1 rounded-xl border border-border bg-card p-4 shadow-none">
                        <h3 className="font-heading mb-1 font-semibold">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Team */}
        {team.length > 0 && (
          <section id="team" className="scroll-mt-24 py-16 md:py-24">
            <div className="container">
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="font-accent mb-3 text-2xl font-medium md:text-3xl">Our team</h2>
                <p className="text-muted-foreground">The people behind your journey</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {team.map((member, index) => (
                  <Card key={`${member.name}-${index}`} className="border-border shadow-none">
                    <CardContent className="p-4 text-center sm:p-6">
                      <div className="relative mx-auto mb-3 size-20 overflow-hidden rounded-full bg-muted sm:mb-4 sm:size-28">
                        {member.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={optimizeImageUrl(member.image, 400, 400)}
                            alt={member.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <Users className="size-8 text-muted-foreground sm:size-12" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-heading mb-1 text-sm font-semibold sm:text-lg">
                        {member.name}
                      </h3>
                      {member.role && (
                        <p className="mb-2 text-xs font-medium text-primary sm:text-sm">
                          {member.role}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {member.bio}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border py-14">
          <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-heading mb-2 text-xl font-semibold">Ready to plan a trip?</h2>
              <p className="text-muted-foreground">We&apos;d love to hear what you have in mind.</p>
            </div>
            <Link
              href="/contact#contact-form"
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
            >
              Contact us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
