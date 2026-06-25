import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTourBySlug, mockTours } from '@/lib/mock-data/tours';
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
  return mockTours.map((tour) => ({
    slug: tour.slug,
  }));
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  if (tour.tour_type === 'custom') {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1">
          <section className="py-32 bg-background">
            <div className="container">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
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
                      {tour.inclusions.map((inclusion, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
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
                        background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
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
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px]">
          <div className="absolute inset-0">
            <img
              src={tour.hero_image}
              alt={tour.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
          <div className="container relative h-full flex items-end pb-16">
            <div className="max-w-3xl">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tours
              </Link>
              <Badge
                className="mb-6 border-0 font-semibold"
                style={{
                  background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                  color: '#FFFFFF'
                }}
              >
                {tour.category}
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                {tour.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">{tour.tagline}</p>
            </div>
          </div>
        </section>

        {/* Tour Info Bar */}
        <section className="shadow-lg bg-background/95 backdrop-blur-md sticky top-20 z-30 shadow-lg">
          <div className="container py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">{tour.duration} Days</span>
                    <span className="text-muted-foreground ml-2">({tour.duration_nights} Nights)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)' }}>
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="capitalize font-bold text-lg">{tour.difficulty_level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #B91C1C 0%, #8B0000 100%)' }}>
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{tour.locations.join(', ')}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: 'var(--prayer-red)' }}>
                    ${tour.price}
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
                <Link href="/contact">
                  <MagneticButton
                    className="rounded-xl px-8 py-4 text-base font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                      border: 'none',
                      color: '#FFFFFF'
                    }}
                  >
                    Book This Tour
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-16">
                {/* Overview */}
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Tour Overview</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">{tour.description}</p>
                </div>

                {/* Highlights */}
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Tour Highlights</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {tour.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl shadow-lg shadow-lgorder hover:border-prayer-red transition-colors">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-muted-foreground font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Day-by-Day Itinerary</h2>
                  <div className="space-y-8">
                    {tour.itinerary.map((day) => (
                      <div key={day.day} className="relative pl-10 pb-10 border-l-4 last:pb-0 last:border-0" style={{ borderColor: 'var(--prayer-red)' }}>
                        <div className="absolute left-0 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-xl font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                          {day.day}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-heading font-bold text-xl mb-2">{day.title}</h3>
                            {day.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                                <MapPin className="h-4 w-4" style={{ color: 'var(--prayer-red)' }} />
                                {day.location}
                              </p>
                            )}
                          </div>
                          <p className="text-muted-foreground text-base leading-relaxed">{day.description}</p>
                          {day.activities && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((activity, i) => (
                                <Badge key={i} variant="secondary" className="text-xs font-semibold">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                            {day.meals && (
                              <div className="flex items-center gap-2">
                                <Utensils className="h-5 w-5" style={{ color: 'var(--prayer-red)' }} />
                                <span className="font-medium">{day.meals}</span>
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="flex items-center gap-2">
                                <Bed className="h-5 w-5" style={{ color: 'var(--prayer-red)' }} />
                                <span className="font-medium">{day.accommodation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid gap-8 sm:grid-cols-2">
                  <Card className="shadow-lg">
                    <CardContent className="p-8">
                      <h3 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        What's Included
                      </h3>
                      <ul className="space-y-3">
                        {tour.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--prayer-red)' }} />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardContent className="p-8">
                      <h3 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                          <X className="h-5 w-5 text-muted-foreground" />
                        </div>
                        What's Excluded
                      </h3>
                      <ul className="space-y-3">
                        {tour.exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Best Season */}
                {tour.best_season && tour.best_season.length > 0 && (
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Best Time to Visit</h2>
                    <div className="flex flex-wrap gap-3">
                      {tour.best_season.map((season) => (
                        <Badge key={season} className="capitalize px-5 py-2 font-semibold shadow-lg" style={{
                          background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                          color: '#FFFFFF',
                          border: 'none'
                        }}>
                          {season}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Altitude Info */}
                {tour.altitude_range && tour.altitude_range !== 'Variable' && (
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Altitude Range</h2>
                    <div className="flex items-center gap-4 p-6 rounded-xl shadow-lg" style={{ borderColor: 'var(--prayer-red)' }}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                        <Mountain className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xl font-bold">{tour.altitude_range}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Booking Card */}
                <Card className="sticky top-32 shadow-lg shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="font-heading font-bold text-2xl mb-2">Book This Tour</h3>
                      <p className="text-muted-foreground">Reserve your spot on this amazing journey</p>
                    </div>
                    <div className="flex justify-between items-baseline pb-6 shadow-lg">
                      <span className="text-muted-foreground">Price per person</span>
                      <span className="text-3xl font-bold" style={{ color: 'var(--prayer-red)' }}>${tour.price}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-bold">{tour.duration} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Difficulty</span>
                        <span className="font-bold capitalize">{tour.difficulty_level}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tour Type</span>
                        <span className="font-bold capitalize">{tour.tour_type}</span>
                      </div>
                    </div>
                    <Link href="/contact" className="block">
                      <MagneticButton
                        className="w-full rounded-xl px-8 py-4 text-base font-semibold"
                        style={{
                          background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                          border: 'none',
                          color: '#FFFFFF'
                        }}
                      >
                        Request Booking
                        <ArrowRight className="w-5 h-5" />
                      </MagneticButton>
                    </Link>
                    <Link href="/contact" className="block">
                      <MagneticButton
                        className="w-full rounded-xl px-8 py-4 text-base font-semibold shadow-lg"
                        variant="outline"
                      >
                        <Mail className="w-5 h-5" />
                        Ask a Question
                      </MagneticButton>
                    </Link>
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card className="shadow-lg">
                  <CardContent className="p-8 space-y-6">
                    <h3 className="font-heading font-bold text-xl">Quick Info</h3>
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold mb-1">Group Size</div>
                          <div className="text-muted-foreground">Small groups, personalized experience</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)' }}>
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold mb-1">Transportation</div>
                          <div className="text-muted-foreground">Private vehicle included</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #B91C1C 0%, #8B0000 100%)' }}>
                          <Heart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold mb-1">Guide</div>
                          <div className="text-muted-foreground">Licensed English-speaking guide</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Need Help */}
                <Card className="shadow-lg" style={{ background: 'linear-gradient(135deg, var(--prayer-red)/10 0%, var(--monastery-red)/10 100%)' }}>
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <p className="font-bold text-lg mb-2">Need help planning?</p>
                      <p className="text-sm text-muted-foreground mb-6">
                        Our team is here to assist you
                      </p>
                      <Link href="/contact" className="block">
                        <MagneticButton
                          className="w-full rounded-xl px-8 py-4 text-base font-semibold shadow-lg"
                          variant="outline"
                        >
                          <Phone className="w-5 h-5" />
                          Contact Us
                        </MagneticButton>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Tours CTA */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Explore More Tours
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover other amazing journeys through Bhutan
            </p>
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
