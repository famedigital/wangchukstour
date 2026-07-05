import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import Link from 'next/link';

const faqs = [
  {
    question: "Do I need a visa to visit Bhutan?",
    answer: "Yes, all international visitors require a visa to enter Bhutan. We arrange this for you as part of your tour package. You'll need to provide passport details and a photo at least 30 days before travel."
  },
  {
    question: "What's the best time to visit Bhutan?",
    answer: "Spring (March-May) and autumn (September-November) are ideal, with clear skies and pleasant temperatures. Winter is colder but offers clear mountain views. Summer brings monsoon rains but lush green landscapes."
  },
  {
    question: "Is travel insurance required?",
    answer: "Yes, comprehensive travel insurance is mandatory for all our tours. It must cover medical emergencies, evacuation, and trip cancellation. We can assist with recommendations if needed."
  },
  {
    question: "What should I pack for Bhutan?",
    answer: "Pack layers for varying temperatures, comfortable walking shoes, rain gear, sun protection, and modest clothing for temple visits. For treks, bring hiking boots, warm clothing, and a good backpack."
  },
  {
    question: "How fit do I need to be for tours?",
    answer: "Cultural tours require moderate fitness for walking and climbing stairs. Treks demand good cardiovascular fitness. We can customize experiences based on your fitness level and preferences."
  },
  {
    question: "What's the currency in Bhutan?",
    answer: "Bhutanese Ngultrum (BTN) is the currency, pegged to Indian Rupee (INR). USD and EUR are widely accepted for tour payments. Credit cards have limited acceptance outside major hotels."
  },
  {
    question: "Are there any health precautions?",
    answer: "Consult your doctor about vaccinations and altitude medication. For high-altitude areas, allow time for acclimatization. Carry basic medications and stay hydrated."
  },
  {
    question: "Can I customize my tour itinerary?",
    answer: "Absolutely! We specialize in customized tours. Tell us your interests, timeframe, and preferences, and we'll create a personalized Bhutan experience just for you."
  }
];

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600">
                Find answers to common questions about traveling to Bhutan
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="font-heading font-semibold text-lg mb-3 text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional Info Box */}
              <div className="mt-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-l-4" style={{ borderLeftColor: '#DC143C' }}>
                <h3 className="font-heading font-semibold text-xl mb-3 text-gray-900">
                  Still Have Questions?
                </h3>
                <p className="text-gray-700 mb-4">
                  Our team is here to help with any questions about traveling to Bhutan. Contact us and we'll be happy to assist you.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">Email: info@wangchuktour.com</p>
                  <p className="text-gray-700">Phone: +975 17643416</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-white">
              Ready to Explore Bhutan?
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-6 max-w-xl mx-auto">
              Let us help you plan your perfect Bhutan adventure
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
                  Get in Touch
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