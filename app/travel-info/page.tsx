import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Plane, Train, Calendar, CreditCard, Phone, FileText } from 'lucide-react';
import Link from 'next/link';

const travelInfo = [
  {
    icon: Plane,
    title: "Getting to Bhutan",
    items: [
      "By Air: Paro International Airport (PBH) from Bangkok, Delhi, Kolkata, Kathmandu, Singapore, and more",
      "DrukAir and Bhutan Airlines operate international flights",
      "By Land: Phuntsholing (from India), Gelephu and Samdrup Jongkhar border crossings",
      "Road travel from India requires valid entry permits"
    ]
  },
  {
    icon: FileText,
    title: "Visa & Permits",
    items: [
      "Visa required for all nationalities (we arrange for you)",
      "Apply at least 30 days before travel with passport copy and photo",
      "SIM (Restricted Area Permit) included for most destinations",
      "Special permits needed for some eastern regions"
    ]
  },
  {
    icon: Calendar,
    title: "Best Time to Visit",
    items: [
      "Spring (Mar-May): Pleasant weather, rhododendrons blooming",
      "Summer (Jun-Aug): Monsoon season, lush landscapes",
      "Autumn (Sep-Nov): Clear skies, festival season",
      "Winter (Dec-Feb): Cold but sunny, great for low-altitude tours"
    ]
  },
  {
    icon: CreditCard,
    title: "Currency & Payments",
    items: [
      "Bhutanese Ngultrum (BTN) = Indian Rupee (INR)",
      "USD/EUR accepted for tour payments",
      "Credit cards limited to major hotels",
      "Carry cash for local markets and small purchases"
    ]
  },
  {
    icon: Phone,
    title: "Communication",
    items: [
      "Local SIM cards available in major towns",
      "International roaming works in most areas",
      "WiFi available in hotels and urban areas",
      "Limited connectivity in remote mountain regions"
    ]
  },
  {
    icon: Train,
    title: "Getting Around",
    items: [
      "Private vehicle with driver included in tours",
      "Comfortable SUVs for road travel",
      "Domestic flights: Paro-Bumthang, Paro-Yangphula",
      "No trains in Bhutan"
    ]
  }
];

export default function TravelInfoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Travel Information
              </h1>
              <p className="text-lg text-gray-600">
                Essential information for planning your Bhutan adventure
              </p>
            </div>
          </div>
        </section>

        {/* Travel Info Cards */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {travelInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: '#DC143C' }}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-gray-900">
                          {info.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {info.items.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* What to Bring */}
              <div className="mt-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-l-4" style={{ borderLeftColor: '#DC143C' }}>
                <h3 className="font-heading font-semibold text-xl mb-4 text-gray-900">What to Bring</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Essential Items</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Valid passport (6+ months validity)</li>
                      <li>• Travel insurance documents</li>
                      <li>• Comfortable walking shoes</li>
                      <li>• Layers for changing temperatures</li>
                      <li>• Rain jacket/umbrella</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Recommended</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Sun protection (hat, sunglasses, sunscreen)</li>
                      <li>• Modest clothing for temples</li>
                      <li>• Camera with extra batteries</li>
                      <li>• Personal medications</li>
                      <li>• Small backpack for day trips</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Health & Safety */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-8">
                <h3 className="font-heading font-semibold text-xl mb-4 text-gray-900">Health & Safety Tips</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Altitude Considerations</h4>
                    <p className="text-sm text-gray-700">
                      Allow time to acclimatize, drink plenty of water, and avoid alcohol initially.
                      Most tourist areas are at moderate altitudes (2,000-2,500m).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Medical Facilities</h4>
                    <p className="text-sm text-gray-700">
                      Basic medical care available in major towns. For serious conditions,
                      evacuation may be required. Comprehensive insurance is essential.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-white">
              Ready to Plan Your Trip?
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-6 max-w-xl mx-auto">
              Contact us for personalized travel advice and tour planning
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <MagneticButton
                  className="rounded-lg px-6 py-3 text-sm font-medium"
                  style={{
                    background: 'var(--color-crimson, #DC143C)',
                    color: '#FFFFFF'
                  }}
                >
                  Contact Us
                </MagneticButton>
              </Link>
              <Link href="/tours">
                <MagneticButton
                  className="rounded-lg px-6 py-3 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  View Tours
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