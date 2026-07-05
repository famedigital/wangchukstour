'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Mountain } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Tours', href: '/tours' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isHomepage = pathname === '/';
  const isToursPage = pathname === '/tours';

  useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > 50);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        (!mounted || scrolled)
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      style={{
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-14 w-auto transition-transform duration-300 group-hover:scale-105">
            <img
              src="https://res.cloudinary.com/hckgrdeh/image/upload/v1782962660/wangchukstlogo_usxclz.png"
              alt="Wangchuks Tours & Treks"
              className="h-full w-auto object-contain"
              style={{ maxHeight: '56px' }}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-5 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden group"
              style={{
                color: '#D4A017',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF6B00';
                e.currentTarget.style.textShadow = '0 0 20px rgba(255, 107, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.3)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D4A017';
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span className="relative z-10">{link.name}</span>
              {/* Premium glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-4 inline-flex items-center justify-center rounded-lg border border-transparent px-5 py-3 text-sm font-medium transition-all hover:scale-105 relative overflow-hidden group"
            style={{
              backgroundColor: '#D4A017',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(212, 160, 23, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B00';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D4A017';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 160, 23, 0.3)';
            }}
          >
            <span className="relative z-10">Get Quote</span>
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative inline-flex items-center justify-center rounded-xl p-3 transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: (isToursPage || scrolled) ? 'var(--muted)' : 'transparent' }}
            aria-label="Toggle menu"
          >
            <Menu
              className={`h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
              style={{ color: (isToursPage || scrolled) ? '#D4A017' : '#FFFFFF' }}
            />
            <X
              className={`absolute h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
              style={{ color: (isToursPage || scrolled) ? '#D4A017' : '#FFFFFF' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/60 backdrop-blur-md shadow-lg">
          <div className="space-y-1 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-lg px-4 py-4 text-base font-medium transition-all duration-300 hover:translate-x-2 hover:translate-x-2"
                style={{ color: '#D4A017', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FF6B00';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#D4A017';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-lg border border-transparent px-5 py-3 text-sm font-medium text-white transition-all hover:scale-105 mt-4"
              style={{
                backgroundColor: '#D4A017',
                boxShadow: '0 4px 14px rgba(212, 160, 23, 0.3)'
              }}
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
