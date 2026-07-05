'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  image: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <Badge
              className="mb-6"
              style={{
                background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              Testimonials
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              What Travelers <span style={{ color: '#DC143C' }}>Say</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Premium Card Design */}
              <div
                className="rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FEFEFE 0%, #F8F8F8 100%)',
                  border: '1px solid rgba(220, 20, 60, 0.1)'
                }}
              >
                {/* Decorative Quote Mark */}
                <div className="absolute top-6 left-8 text-8xl font-serif opacity-5" style={{ color: '#DC143C' }}>
                  "
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-8">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" style={{ color: '#FFD700' }} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl leading-relaxed mb-10 font-medium" style={{ color: '#1C1917', lineHeight: '1.8' }}>
                  "{testimonials[activeTestimonial].text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-5">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-full p-1"
                      style={{ background: 'linear-gradient(135deg, #DC143C 0%, #FFD700 100%)' }}
                    >
                      <img
                        src={testimonials[activeTestimonial].image}
                        alt={testimonials[activeTestimonial].name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-heading font-bold text-lg" style={{ color: '#DC143C' }}>
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="flex items-center gap-2 mt-1" style={{ color: '#78716C' }}>
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{testimonials[activeTestimonial].location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeTestimonial === index ? '#DC143C' : '#E5E5E5',
                  transform: activeTestimonial === index ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}