'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Heart, Shield, Mountain, Clock } from 'lucide-react';

const differentiators = [
  {
    icon: Heart,
    title: 'Local Expertise',
    description: 'Bhutanese-owned since 2008. We know every trail and temple in the Himalayan kingdom.',
    color: 'var(--prayer-red)',
  },
  {
    icon: Shield,
    title: 'Authentic Experiences',
    description: 'No tourist traps. Genuine Bhutanese culture, real communities, meaningful connections.',
    color: 'var(--prayer-blue)',
  },
  {
    icon: Mountain,
    title: 'Sustainable Tourism',
    description: 'Responsible tourism that respects environment and preserves cultural heritage.',
    color: 'var(--prayer-green)',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Always available to assist you throughout your journey, from planning to departure.',
    color: 'var(--prayer-yellow)',
  },
];

export function DifferentiatorsSection() {
  return (
    <>
      <ScrollReveal>
        <div className="text-center mb-20">
          <div
            className="inline-block mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0 rounded"
            style={{
              background: 'linear-gradient(135deg, #E63946 0%, #DC143C 100%)',
              color: '#FFFFFF'
            }}
          >
            Why Choose Us
          </div>
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            The Wangchuks <span style={{ color: '#DC143C' }}>Difference</span>
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
        {differentiators.map((item, index) => (
          <ScrollReveal key={index} direction="up" delay={index * 0.1}>
            <motion.div
              className="text-center group"
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="mx-auto mb-8 w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: `${item.color}20` }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <item.icon className="w-12 h-12" style={{ color: item.color }} />
              </motion.div>
              <h3 className="font-heading font-bold mb-4 text-xl group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {item.description}
              </p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}