import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <section className="py-20 bg-background">
            <div className="container px-4">
              <div className="mx-auto max-w-2xl text-center">
                <Users className="mx-auto mb-4 h-16 w-16 text-primary" />
                <h1 className="font-heading text-3xl font-bold mb-4">{tour.title}</h1>
                <p className="text-lg text-muted-foreground mb-8">{tour.description}</p>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This is a custom tour option. Let us design your perfect Bhutanese experience
                    tailored to your interests, schedule, and preferences.
                  </p>
                  <div className="py-8">
                    <h3 className="font-semibold mb-4">What's Included:</h3>
                    <ul className="grid gap-2 text-left text-sm">
                      {tour.inclusions.map((inclusion, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {inclusion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-10 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/80"
                    >
                      Request Custom Tour
                    </Link>
                    <Link
                      href="/tours"
                      className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-background px-10 py-6 text-lg font-medium text-foreground transition-all hover:bg-muted"
                    >
                      View All Tours
                    </Link>
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px]">
          <div className="absolute inset-0">
            <img
              src={tour.hero_image}
              alt={tour.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          <div className="container relative px-4 h-full flex items-end pb-12">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-primary">{tour.category}</Badge>
              <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl mb-4">
                {tour.title}
              </h1>
              <p className="text-lg text-muted-foreground">{tour.tagline}</p>
            </div>
          </div>
        </section>

        {/* Tour Info Bar */}
        <section className="border-b bg-background/95 backdrop-blur sticky top-16 z-30">
          <div className="container px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{tour.duration} Days</span>
                  <span className="text-muted-foreground">({tour.duration_nights} Nights)</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="capitalize">{tour.difficulty_level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{tour.locations.join(', ')}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${tour.price}
                  </div>
                  <div className="text-xs text-muted-foreground">per person</div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-10 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/80"
                >
                  Book This Tour
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-background">
          <div className="container px-4">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Overview */}
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-4">Tour Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
                </div>

                {/* Highlights */}
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-4">Tour Highlights</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {tour.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Star className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-6">Day-by-Day Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day) => (
                      <div key={day.day} className="relative pl-8 pb-8 border-l-2 border-muted last:pb-0">
                        <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {day.day}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-heading font-semibold text-lg">{day.title}</h3>
                            {day.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {day.location}
                              </p>
                            )}
                          </div>
                          <p className="text-muted-foreground">{day.description}</p>
                          {day.activities && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((activity, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {day.meals && (
                              <div className="flex items-center gap-1">
                                <Utensils className="h-4 w-4" />
                                <span>{day.meals}</span>
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                <span>{day.accommodation}</span>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tour.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading flex items-center gap-2">
                        <X className="h-5 w-5 text-destructive" />
                        What's Excluded
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tour.exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
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
                    <h2 className="font-heading text-2xl font-bold mb-4">Best Time to Visit</h2>
                    <div className="flex flex-wrap gap-2">
                      {tour.best_season.map((season) => (
                        <Badge key={season} variant="secondary" className="capitalize">
                          {season}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Altitude Info */}
                {tour.altitude_range && tour.altitude_range !== 'Variable' && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4">Altitude Range</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mountain className="h-5 w-5 text-primary" />
                      <span>{tour.altitude_range}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Booking Card */}
                <Card className="sticky top-32">
                  <CardHeader>
                    <CardTitle className="font-heading">Book This Tour</CardTitle>
                    <CardDescription>
                      Reserve your spot on this amazing journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-muted-foreground">Price per person</span>
                      <span className="text-2xl font-bold text-primary">${tour.price}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{tour.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty</span>
                        <span className="font-medium capitalize">{tour.difficulty_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tour Type</span>
                        <span className="font-medium capitalize">{tour.tour_type}</span>
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-10 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/80 w-full"
                    >
                      Request Booking
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-background px-10 py-6 text-lg font-medium text-foreground transition-all hover:bg-muted w-full"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Ask a Question
                    </Link>
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Group Size</div>
                        <div className="text-muted-foreground">Small groups, personalized experience</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Car className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Transportation</div>
                        <div className="text-muted-foreground">Private vehicle included</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Guide</div>
                        <div className="text-muted-foreground">Licensed English-speaking guide</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Need Help */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-center">
                      <p className="font-medium mb-2">Need help planning?</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Our team is here to assist you
                      </p>
                      <div className="space-y-2">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-background px-10 py-6 text-lg font-medium text-foreground transition-all hover:bg-muted w-full"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Us
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Tours CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">
              Explore More Tours
            </h2>
            <p className="text-muted-foreground mb-6">
              Discover other amazing journeys through Bhutan
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-background px-10 py-6 text-lg font-medium text-foreground transition-all hover:bg-muted"
            >
              View All Tours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
