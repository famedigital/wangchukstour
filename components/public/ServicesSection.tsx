'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Mountain, Users, Sparkles, TrendingUp, Calendar, Shield, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Mountain,
    title: 'Fixed Departure Tours',
    description: 'Join small group departures with set dates. Perfect for solo travelers seeking shared experiences.',
    gradient: 'from-prayer-red to-monastery-red',
  },
  {
    icon: Users,
    title: 'Custom Private Tours',
    description: 'Design your own journey. Choose your dates, destinations, and pace with our expert guidance.',
    gradient: 'from-prayer-blue to-primary',
  },
  {
    icon: Sparkles,
    title: 'Cultural Experiences',
    description: 'Immerse in Bhutanese traditions. Visit monasteries, witness festivals, meet local artisans.',
    gradient: 'from-prayer-yellow to-accent',
  },
  {
    icon: TrendingUp,
    title: 'Trekking Adventures',
    description: 'Challenge yourself on Himalayan trails. From gentle walks to expeditions across mountain passes.',
    gradient: 'from-prayer-green to-primary',
  },
  {
    icon: Calendar,
    title: 'Festival Tours',
    description: 'Experience colorful Tsechus. Watch masked dances and receive blessings from sacred relics.',
    gradient: 'from-monastery-red to-prayer-red',
  },
  {
    icon: Shield,
    title: 'Logistics & Support',
    description: 'Complete travel support. Visa, permits, transport, guides, accommodation—everything arranged.',
    gradient: 'from-primary to-prayer-blue',
  },
];

export function ServicesSection() {
  return (
    <>
      <ScrollReveal>
        <div className="text-center mb-20">
          <div
            className="inline-block mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0 rounded"
            style={{
              background: 'var(--primary)',
              color: '#FFFFFF'
            }}
          >
            Our Services
          </div>
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            What We <span style={{ color: 'var(--primary)' }}>Offer</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            From cultural immersions to high-altitude adventures, we craft experiences
            that connect you with the heart of Bhutan.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ScrollReveal key={index} direction="up" delay={index * 0.1}>
            <motion.div
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, var(--background) 0%, var(--muted) 100%)`,
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Gradient Border Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${service.gradient.split(' ')[0].replace('from-', 'var(--')}, ${service.gradient.split(' ')[1].replace('to-', 'var(--')})`,
                  filter: 'blur(20px)',
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${service.gradient.split(' ')[0].replace('from-', 'var(--')}40` }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <service.icon className="w-8 h-8" style={{ color: service.gradient.split(' ')[0].replace('from-', 'var(--') }} />
                </motion.div>

                <h3 className="font-heading text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {service.description}
                </p>

                <motion.div
                  className="mt-6 flex items-center gap-2 text-primary font-medium"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}