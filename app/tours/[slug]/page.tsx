import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTourBySlug, getAllTours, Tour } from '@/lib/database';
import { formatTourPrice } from '@/lib/tour-options';
import {
  Clock,
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  Mountain,
  Check,
  X,
  Utensils,
  Bed,
  Car,
  Star,
  Heart,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export async function generateStaticParams() {
  // Return empty array to disable static generation
  // Routes will be generated on-demand
  return [];
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  let tour: Tour | null = null;
  let errorOccurred = false;

  try {
    const { slug } = await params;
    console.log('[PAGE] Starting tour detail page for slug:', slug);

    tour = await getTourBySlug(slug);

    if (!tour) {
      console.log('[PAGE] Tour not found for slug:', slug);
      notFound();
    }

    console.log('[PAGE] Tour loaded successfully:', {
      id: tour.id,
      title: tour.title,
      slug: tour.slug
    });
  } catch (error) {
    console.error('[PAGE] Error in tour detail page:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    errorOccurred = true;

    // Return a custom error page instead of crashing
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-6 py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Unable to Load Tour
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  We encountered an issue while loading this tour. This might be a temporary problem.
                </p>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4 text-left">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Error details:</strong>
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {error instanceof Error ? error.message : 'Unknown error occurred'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/tours">
                      <MagneticButton
                        className="rounded-lg px-6 py-3 text-sm font-medium"
                        style={{
                          background: 'var(--primary)',
                          color: '#FFFFFF'
                        }}
                      >
                        View All Tours
                      </MagneticButton>
                    </Link>
                    <Link href="/contact">
                      <MagneticButton
                        className="rounded-lg px-6 py-3 text-sm font-medium"
                        variant="outline"
                      >
                        Contact Support
                      </MagneticButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorOccurred) {
    return null; // Should not reach here due to early return
  }

  if (tour.tour_type === 'custom') {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1">
          <section className="py-32 bg-background">
            <div className="container">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl" style={{ background: 'var(--primary)' }}>
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{tour.title}</h1>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">{tour.description}</p>
                <div className="bg-muted/30 rounded-2xl p-8 mb-10">
                  <p className="text-lg text-muted-foreground mb-6">
                    This is a custom tour option. Let us design your perfect Bhutanese experience
                    tailored to your interests, schedule, and preferences.
                  </p>
                  <div className="py-6">
                    <h3 className="font-bold text-xl mb-6">What's Included:</h3>
                    <ul className="grid gap-3 text-left">
                      {tour.inclusions?.map((inclusion, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--primary)' }}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-muted-foreground">{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/contact">
                    <MagneticButton
                      className="rounded-xl px-10 py-6 text-lg font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary) 100%)',
                        border: 'none',
                        color: '#FFFFFF'
                      }}
                    >
                      Request Custom Tour
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </Link>
                  <Link href="/tours">
                    <MagneticButton
                      className="rounded-xl px-10 py-6 text-lg font-semibold shadow-lg"
                      variant="outline"
                    >
                      View All Tours
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section - Modern & Minimal */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={tour.hero_image_url || tour.thumbnail_url || '/placeholder.jpg'}
              alt={tour.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              style={{ objectPosition: 'center 40%' }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative h-full flex items-center justify-center pt-32 pb-20">
            <div className="text-center px-6 max-w-4xl">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all mb-6 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tours
              </Link>

              <Badge
                className="mb-4 px-4 py-1.5 text-xs font-medium"
                style={{
                  background: 'var(--primary)',
                  color: '#FFFFFF'
                }}
              >
                {tour.category || 'Tour'}
              </Badge>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
                {tour.title}
              </h1>

              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                {tour.tagline || 'Discover the beauty of Bhutan'}
              </p>
            </div>
          </div>
        </section>

        {/* Mobile Booking Card - Top on mobile */}
        <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 md:px-6 py-3 border-b border-border shadow-sm">
          <div className="flex flex-row items-center justify-between gap-3">
            {/* Price Info */}
            <div className="flex flex-col">
              <div className="text-xs text-muted-foreground">Starting from</div>
              <div className="text-base font-bold" style={{ color: 'var(--primary)' }}>
                {formatTourPrice(tour.price, tour.category)}
              </div>
              <div className="text-xs text-muted-foreground">{tour.duration || 'N/A'} days • {tour.difficulty_level || 'N/A'}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-2">
              <Link href={`/contact?intent=book&tour=${tour.slug}&title=${encodeURIComponent(tour.title || '')}#contact-form`}>
                <MagneticButton
                  className="rounded-lg px-4 py-2 text-sm font-medium"
                  style={{
                    background: 'var(--primary)',
                    color: '#FFFFFF'
                  }}
                >
                  Book Now
                </MagneticButton>
              </Link>
              <Link href={`/contact?intent=inquire&tour=${tour.slug}&title=${encodeURIComponent(tour.title || '')}#contact-form`}>
                <MagneticButton
                  className="rounded-lg px-4 py-2 text-sm font-medium"
                  variant="outline"
                >
                  Inquire
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Left Column - Journey Overview and Content */}
              <div className="w-full lg:w-[80%] space-y-12" style={{ width: '80%' }}>
                {/* Overview */}
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    Journey Overview
                  </h2>
                  <p className="text-base text-foreground/80 leading-relaxed">
                    {tour.description || 'Experience the magic of Bhutan with this unforgettable journey.'}
                  </p>
                </div>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-foreground">
                    Tour Highlights
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {tour.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5" style={{ background: 'var(--primary)' }}>
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-sm text-foreground/80">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 text-foreground">
                    Day-by-Day Itinerary
                  </h2>
                  <div className="space-y-10">
                    {tour.itinerary.map((day, i) => {
                      const itineraryLength = tour.itinerary?.length || 1;
                      const progress = i / (itineraryLength - 1);
                      const borderColor = progress === 0 ? 'var(--primary)' :
                                        progress < 0.5 ? 'var(--primary)' :
                                        progress < 0.75 ? '#8B0000' :
                                        '#660000';

                      return (
                        <div key={day.day} className="relative pl-10 pb-8 last:pb-0" style={{ borderLeft: i < itineraryLength - 1 ? `3px solid ${borderColor}` : 'none' }}>
                          <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold shadow-sm" style={{ background: `linear-gradient(135deg, ${borderColor} 0%, ${borderColor}99 100%)`, color: '#FFFFFF', border: '3px solid #FFFFFF' }}>
                            {day.day}
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="font-heading font-semibold text-xl mb-2 text-foreground">{day.title}</h3>
                              {day.location && (
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <MapPin className="h-4 w-4" style={{ color: borderColor }} />
                                  {day.location}
                                </p>
                              )}
                            </div>

                            <p className="text-base text-foreground/80 leading-relaxed">{day.description}</p>

                          {day.activities && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((activity, i) => (
                                <Badge key={i} className="text-xs px-3 py-1 font-medium" style={{ background: borderColor, color: '#FFFFFF', border: 'none' }}>
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-2">
                            {day.meals && (
                              <div className="flex items-center gap-2">
                                <Utensils className="h-5 w-5" style={{ color: borderColor }} />
                                <span>{day.meals}</span>
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="flex items-center gap-2">
                                <Bed className="h-5 w-5" style={{ color: borderColor }} />
                                <span>{day.accommodation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              {(tour.inclusions || tour.exclusions) && (
                <div className="grid gap-6 md:grid-cols-2">
                  {tour.inclusions && tour.inclusions.length > 0 && (
                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                        <Check className="h-5 w-5" style={{ color: '#10B981' }} />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {tour.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                            <span className="text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tour.exclusions && tour.exclusions.length > 0 && (
                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                        <X className="h-5 w-5 text-muted-foreground" />
                        What's Excluded
                      </h3>
                      <ul className="space-y-2">
                        {tour.exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Best Season */}
              {tour.best_season && tour.best_season.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    Best Time to Visit
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tour.best_season.map((season) => (
                      <Badge key={season} className="capitalize px-4 py-1.5 text-sm font-medium" style={{ background: 'var(--primary)', color: '#FFFFFF', border: 'none' }}>
                        {season}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Altitude */}
                {tour.altitude_range && tour.altitude_range !== 'Variable' && (
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-foreground">
                      Altitude Range
                    </h2>
                    <div className="flex items-center gap-4 bg-muted rounded-xl p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'var(--primary)' }}>
                        <Mountain className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">{tour.altitude_range}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Booking Card - Desktop only */}
              <div className="hidden lg:block lg:w-[20%] shrink-0" style={{ width: '20%' }}>
                <div className="lg:sticky lg:top-8 backdrop-blur-md bg-background/90 rounded-2xl shadow-xl p-8">
                  <h3 className="font-heading font-bold text-xl mb-1 text-foreground">Book This Tour</h3>
                  <p className="text-sm text-muted-foreground mb-6">Reserve your spot on this amazing journey</p>

                  <div className="space-y-3 pb-6 mb-6" style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Price per person</span>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Starting from</div>
                        <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                          {formatTourPrice(tour.price, tour.category)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{tour.duration || 'N/A'} days</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className="font-medium capitalize text-foreground">{tour.difficulty_level || 'N/A'}</span>
                    </div>
                  </div>

                  <Link href={`/contact?intent=book&tour=${tour.slug}&title=${encodeURIComponent(tour.title || '')}#contact-form`} className="block mb-3">
                    <MagneticButton
                      className="w-full rounded-lg px-6 py-3 text-sm font-medium"
                      style={{
                        background: 'var(--primary)',
                        color: '#FFFFFF'
                      }}
                    >
                      Request Booking
                    </MagneticButton>
                  </Link>

                  <Link href={`/contact?intent=inquire&tour=${tour.slug}&title=${encodeURIComponent(tour.title || '')}#contact-form`} className="block">
                    <MagneticButton
                      className="w-full rounded-lg px-5 py-2.5 text-sm font-medium"
                      variant="outline"
                    >
                      Ask a Question
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gray-900">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-white">
              Ready to Explore Bhutan?
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-6 max-w-xl mx-auto">
              Discover other amazing journeys through the Land of the Thunder Dragon
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-start">
              <Link href="/tours">
                <MagneticButton
                  className="rounded-lg px-6 py-3 text-sm font-medium"
                  style={{
                    background: 'var(--primary)',
                    color: '#FFFFFF'
                  }}
                >
                  View All Tours
                </MagneticButton>
              </Link>
              <Link href="/contact">
                <MagneticButton
                  className="rounded-lg px-6 py-3 text-sm font-medium bg-background/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  Plan Custom Trip
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
