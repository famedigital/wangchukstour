import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Plane, Train, Calendar, CreditCard, Phone, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const travelInfo = [
  {
    icon: Plane,
    title: 'Getting to Bhutan',
    items: [
      'By Air: Paro International Airport (PBH) from Bangkok, Delhi, Kolkata, Kathmandu, Singapore, and more',
      'DrukAir and Bhutan Airlines operate international flights',
      'By Land: Phuntsholing (from India), Gelephu and Samdrup Jongkhar border crossings',
      'Road travel from India requires valid entry permits',
    ],
  },
  {
    icon: FileText,
    title: 'Visa & Permits',
    items: [
      'Visa required for all nationalities (we arrange for you)',
      'Apply at least 30 days before travel with passport copy and photo',
      'SIM (Restricted Area Permit) included for most destinations',
      'Special permits needed for some eastern regions',
    ],
  },
  {
    icon: Calendar,
    title: 'Best Time to Visit',
    items: [
      'Spring (Mar-May): Pleasant weather, rhododendrons blooming',
      'Summer (Jun-Aug): Monsoon season, lush landscapes',
      'Autumn (Sep-Nov): Clear skies, festival season',
      'Winter (Dec-Feb): Cold but sunny, great for low-altitude tours',
    ],
  },
  {
    icon: CreditCard,
    title: 'Currency & Payments',
    items: [
      'Bhutanese Ngultrum (BTN) = Indian Rupee (INR)',
      'USD/EUR accepted for tour payments',
      'Credit cards limited to major hotels',
      'Carry cash for local markets and small purchases',
    ],
  },
  {
    icon: Phone,
    title: 'Communication',
    items: [
      'Local SIM cards available in major towns',
      'International roaming works in most areas',
      'WiFi available in hotels and urban areas',
      'Limited connectivity in remote mountain regions',
    ],
  },
  {
    icon: Train,
    title: 'Getting Around',
    items: [
      'Private vehicle with driver included in tours',
      'Comfortable SUVs for road travel',
      'Domestic flights: Paro-Bumthang, Paro-Yangphula',
      'No trains in Bhutan',
    ],
  },
];

export default function TravelInfoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Plan your trip
              </p>
              <h1 className="font-accent mb-4 text-4xl font-medium text-foreground md:text-5xl">
                Travel information
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Essential information for planning your Bhutan adventure
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 md:grid-cols-2">
                {travelInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-sm"
                    >
                      <div className="mb-4 flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-heading pt-1 text-lg font-semibold text-foreground">{info.title}</h3>
                      </div>
                      <ul className="space-y-2 pl-[3.75rem]">
                        {info.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 rounded-xl border border-border border-l-4 border-l-primary bg-muted/40 p-8">
                <h3 className="font-accent mb-4 text-xl font-medium text-foreground">What to bring</h3>
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-heading font-semibold text-foreground">Essential items</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li>Valid passport (6+ months validity)</li>
                      <li>Travel insurance documents</li>
                      <li>Comfortable walking shoes</li>
                      <li>Layers for changing temperatures</li>
                      <li>Rain jacket or umbrella</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-heading font-semibold text-foreground">Recommended</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li>Sun protection (hat, sunglasses, sunscreen)</li>
                      <li>Modest clothing for temples</li>
                      <li>Camera with extra batteries</li>
                      <li>Personal medications</li>
                      <li>Small backpack for day trips</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-border bg-card p-8">
                <h3 className="font-accent mb-4 text-xl font-medium text-foreground">Health &amp; safety tips</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-heading font-semibold text-foreground">Altitude considerations</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Allow time to acclimatize, drink plenty of water, and avoid alcohol initially. Most tourist
                      areas are at moderate altitudes (2,000–2,500m).
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-heading font-semibold text-foreground">Medical facilities</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Basic medical care available in major towns. For serious conditions, evacuation may be
                      required. Comprehensive insurance is essential.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16 md:py-20">
          <div className="container text-center">
            <h2 className="font-accent mb-3 text-2xl font-medium text-secondary-foreground md:text-3xl">
              Ready to plan your trip?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-secondary-foreground/75">
              Contact us for personalized travel advice and tour planning
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }))}>
                Contact Us
              </Link>
              <Link
                href="/tours"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-secondary-foreground/25 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground'
                )}
              >
                View Tours
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
