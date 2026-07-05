'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Image with Punakha Dzong */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto,w_1920,h_1080,c_limit/v1782965945/punakhadzong_xkcrcu.jpg"
          alt="Punakha Dzong"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark gradient overlay - balanced for image visibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.3), rgba(0,0,0,0.5))'
          }}
        />
      </div>

      <div className="container relative z-10 text-center px-6">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Ready to Explore Bhutan?
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            With <span className="font-semibold text-white">15+ years</span> of crafting journeys through the Land of the Thunder Dragon,
            we'll create your transformational Himalayan experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <button className="group px-8 py-4 bg-white text-black font-semibold rounded-none hover:bg-gray-100 transition-all duration-300 text-base">
                Start Your Journey
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}