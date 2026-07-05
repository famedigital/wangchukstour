'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Compass, Users, Book, Mail, Mountain } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tours', href: '/tours', icon: Compass },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Blog', href: '/blog', icon: Book },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export function Navigation() {
  const pathname = usePathname();
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
    <>
      <nav
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 ${
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
          <div className="flex items-center gap-1">
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
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-2xl border-t border-gray-200">
        <div className="flex flex-row">
          {/* Logo */}
          <Link
            href="/"
            className="flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 relative group"
          >
            <div className="h-8 w-8 mb-1 transition-transform duration-300 group-hover:scale-105">
              <img
                src="https://res.cloudinary.com/hckgrdeh/image/upload/v1782962660/wangchukstlogo_usxclz.png"
                alt="Wangchuks Tours & Treks"
                className="h-full w-auto object-contain"
              />
            </div>
            <span className="text-xs font-medium" style={{ color: '#D4A017' }}>
              Wangchuks
            </span>
          </Link>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 relative group"
                style={{
                  backgroundColor: isActive ? 'rgba(212, 160, 23, 0.1)' : 'transparent'
                }}
              >
                <Icon
                  className="h-6 w-6 mb-1 transition-all duration-300"
                  style={{
                    color: isActive ? '#D4A017' : '#6B7280',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
                <span
                  className="text-xs font-medium transition-all duration-300"
                  style={{
                    color: isActive ? '#D4A017' : '#6B7280'
                  }}
                >
                  {link.name}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-t-full"
                       style={{ backgroundColor: '#D4A017' }} />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
