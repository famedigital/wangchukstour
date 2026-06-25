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

  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      (isHomepage && !scrolled)
        ? 'bg-transparent'
        : 'bg-background/95 backdrop-blur-md shadow-lg'
    }`}>
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105">
            <div className="absolute inset-0" style={{ background: (isHomepage && !scrolled) ? '#DC143C' : 'var(--primary)' }} />
            <Mountain className="relative h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col transition-transform duration-300 group-hover:translate-x-1">
            <span className={`text-lg font-heading font-bold leading-tight ${(isHomepage && !scrolled) ? 'text-white' : ''}`}>
              Wangchuk Tours & Treks
            </span>
            <span className={`text-xs leading-tight ${(isHomepage && !scrolled) ? 'text-white/80' : ''}`} style={{ color: (isHomepage && !scrolled) ? '' : 'var(--muted-foreground)' }}>
              Discover the Last Shangri-La
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-primary/5 group relative ${(isHomepage && !scrolled) ? 'text-white hover:text-white/90' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-4 inline-flex items-center justify-center rounded-lg border border-transparent px-5 py-3 text-sm font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: (isHomepage && !scrolled) ? '#DC143C' : 'var(--primary)',
              color: '#FFFFFF'
            }}
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative inline-flex items-center justify-center rounded-xl p-3 transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: (isHomepage && !scrolled) ? 'transparent' : 'var(--muted)' }}
            aria-label="Toggle menu"
          >
            <Menu className={`h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'} ${(isHomepage && !scrolled) ? 'text-white' : ''}`} />
            <X className={`absolute h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'} ${(isHomepage && !scrolled) ? 'text-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-background/95 backdrop-blur-md shadow-lg">
          <div className="space-y-1 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-lg px-4 py-4 text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-primary/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 mt-4"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
