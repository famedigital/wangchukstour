'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Loader2, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=faq');
      const data = await response.json();

      if (response.ok) {
        // Fetch active FAQs
        const faqsResponse = await fetch('/api/admin/content/faqs');
        const faqsData = await faqsResponse.json();

        if (faqsResponse.ok) {
          const activeFaqs = faqsData.faqs.filter((faq: any) => faq.is_active);
          setFaqs(activeFaqs);

          // Extract unique categories
          const uniqueCategories = Array.from(new Set(activeFaqs.map((faq: any) => faq.category))) as string[];
          setCategories(uniqueCategories);
        }
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const optimizeImageUrl = (url: string, width: number, height: number) => {
    if (!url) return '';
    if (url.includes('cloudinary')) {
      const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
      return url.replace('/image/upload/', `/image/upload/${transformations}/`);
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-prayer-red animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchFAQs}
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/v1782911267/tigernest_paro_wdenqu.jpg', 1920, 1080)}
              alt="Frequently Asked Questions"
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
                  FAQ
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
                  Find answers to common questions about traveling to Bhutan with our tours
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-muted/30 backdrop-blur-md sticky top-20 z-30 shadow-premium-sm">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl shadow-premium-sm focus:shadow-premium-md transition-shadow duration-300 outline-none bg-white"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-white shadow-premium-md'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  style={selectedCategory === 'all' ? {
                    color: '#DC143C',
                    border: '2px solid #DC143C'
                  } : {}}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-white shadow-premium-md'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    style={selectedCategory === category ? {
                      color: '#DC143C',
                      border: '2px solid #DC143C'
                    } : {}}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQs by Category */}
        <section className="py-16 md:py-20">
          <div className="container">
            {Object.keys(groupedFaqs).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedFaqs).map(([category, categoryFaqs]: [string, FAQ[]]) => (
                  <div key={category}>
                    <ScrollReveal>
                      <div className="mb-6">
                        <h2 className="font-heading text-2xl font-bold">{category}</h2>
                        <p className="text-muted-foreground">{categoryFaqs.length} questions</p>
                      </div>
                    </ScrollReveal>

                    <div className="space-y-4">
                      {categoryFaqs.map((faq, faqIndex) => {
                        const globalIndex = filteredFaqs.indexOf(faq);
                        const isOpen = openIndex === globalIndex;

                        return (
                          <ScrollReveal key={faq.id} delay={faqIndex * 50}>
                            <Card className="hover:shadow-premium-md transition-all duration-300">
                              <CardContent className="p-0">
                                <button
                                  onClick={() => toggleFAQ(globalIndex)}
                                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                                >
                                  <div className="flex-1">
                                    <h3 className="font-heading font-semibold text-lg mb-2">
                                      {faq.question}
                                    </h3>
                                  </div>
                                  <div className="flex-shrink-0 pt-1">
                                    {isOpen ? (
                                      <ChevronUp className="h-5 w-5 text-prayer-red" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5 text-prayer-red" />
                                    )}
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-6 pb-6 pt-0">
                                        <div className="h-px w-full bg-border my-4" />
                                        <p className="text-muted-foreground leading-relaxed">
                                          {faq.answer}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </CardContent>
                            </Card>
                          </ScrollReveal>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">No FAQs found</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your filters or search query.'
                    : 'No FAQs available yet.'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                      border: 'none'
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/v1782965945/punakhadzong_xkcrcu.jpg', 1920, 1080)}
              alt="Contact Us"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/85" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
          </div>

          <div className="relative container text-center">
            <ScrollReveal>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Still Have Questions?
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                Our team is here to help you plan your perfect Bhutan adventure. Reach out to us and we'll get back to you within 24 hours.
              </p>
              <Link href="/contact">
                <MagneticButton
                  className="rounded-xl px-10 py-6 text-lg font-semibold"
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--prayer-red)',
                    border: 'none'
                  }}
                >
                  Contact Us
                </MagneticButton>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}