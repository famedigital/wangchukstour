'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Compass, Users, Book, Mail, Mountain, MessageCircle } from 'lucide-react';

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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white backdrop-blur-lg shadow-2xl border-t-2 border-gray-200 safe-area-inset-bottom">
        <div className="flex flex-row max-w-screen-lg mx-auto">
          {/* Navigation Links */}
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 relative group min-w-0 flex-1"
                style={{
                  backgroundColor: isActive ? 'rgba(220, 20, 60, 0.1)' : 'transparent'
                }}
              >
                <div className="relative mb-1">
                  <Icon
                    className="h-6 w-6 transition-all duration-300"
                    style={{
                      color: isActive ? '#DC143C' : '#1F2937',
                      strokeWidth: '2',
                      fill: isActive ? '#DC143C' : 'none',
                      fillOpacity: isActive ? '0.2' : '0'
                    }}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold transition-all duration-300 leading-none whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{
                    color: isActive ? '#DC143C' : '#374151'
                  }}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/97517643416"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 relative group min-w-0 flex-1"
          >
            <div className="relative mb-1">
              <MessageCircle
                className="h-6 w-6 transition-all duration-300"
                style={{
                  color: '#25D366',
                  strokeWidth: '2',
                  fill: '#25D366',
                  fillOpacity: '0.2'
                }}
              />
            </div>
            <span
              className="text-[10px] font-semibold transition-all duration-300 leading-none whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                color: '#059669'
              }}
            >
              WhatsApp
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
