'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Compass, Users, Book, Mail, MessageCircle, ChevronDown } from 'lucide-react';

const baseNavLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Blog', href: '/blog', icon: Book },
  { name: 'Contact', href: '/contact', icon: Mail },
];

type TourCategory = { name: string; slug: string };

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tourCategories, setTourCategories] = useState<TourCategory[]>([]);
  const [toursOpen, setToursOpen] = useState(false);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > 50);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/tour-categories')
      .then((r) => r.json())
      .then((data) => setTourCategories(data.categories || []))
      .catch(() => setTourCategories([
        { name: 'International Tour', slug: 'international' },
        { name: 'Regional Tour', slug: 'regional' },
      ]));
  }, []);

  const isToursActive = pathname === '/tours' || pathname.startsWith('/tours');

  return (
    <>
      <nav
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 ${
          !mounted || scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        style={{ transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease' }}
      >
        <div className="container flex h-20 items-center justify-between">
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

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="px-5 py-3 text-sm font-medium rounded-lg"
              style={{ color: '#D4A017' }}
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setToursOpen(true)}
              onMouseLeave={() => setToursOpen(false)}
            >
              <button
                type="button"
                className="px-5 py-3 text-sm font-medium rounded-lg inline-flex items-center gap-1"
                style={{ color: isToursActive ? '#FF6B00' : '#D4A017' }}
                onClick={() => setToursOpen((v) => !v)}
              >
                Tours <ChevronDown className="h-4 w-4" />
              </button>
              {toursOpen && (
                <div className="absolute top-full left-0 pt-2 min-w-[220px]">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                    <Link
                      href="/tours"
                      className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-700"
                    >
                      All Tours
                    </Link>
                    {tourCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/tours?category=${cat.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-700"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {baseNavLinks.filter((l) => l.name !== 'Home').map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-5 py-3 text-sm font-medium rounded-lg"
                style={{ color: '#D4A017' }}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/contact"
              className="ml-4 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium"
              style={{ backgroundColor: '#D4A017', color: '#FFFFFF' }}
            >
              Get Quote
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t-2 border-gray-200 safe-area-inset-bottom">
        {mobileToursOpen && (
          <div className="border-b bg-white px-3 py-2 grid grid-cols-2 gap-2">
            <Link
              href="/tours"
              onClick={() => setMobileToursOpen(false)}
              className="min-h-11 flex items-center justify-center rounded-lg bg-gray-50 text-sm font-medium"
            >
              All Tours
            </Link>
            {tourCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tours?category=${cat.slug}`}
                onClick={() => setMobileToursOpen(false)}
                className="min-h-11 flex items-center justify-center rounded-lg bg-gray-50 text-sm font-medium text-center px-2"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        <div className="flex flex-row max-w-screen-lg mx-auto">
          <Link href="/" className="flex flex-col items-center justify-center py-3 px-2 min-w-0 flex-1">
            <Home className="h-6 w-6 mb-1" style={{ color: pathname === '/' ? '#DC143C' : '#1F2937' }} />
            <span className="text-[10px] font-semibold" style={{ color: pathname === '/' ? '#DC143C' : '#374151' }}>Home</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileToursOpen((v) => !v)}
            className="flex flex-col items-center justify-center py-3 px-2 min-w-0 flex-1"
          >
            <Compass className="h-6 w-6 mb-1" style={{ color: isToursActive || mobileToursOpen ? '#DC143C' : '#1F2937' }} />
            <span className="text-[10px] font-semibold" style={{ color: isToursActive || mobileToursOpen ? '#DC143C' : '#374151' }}>Tours</span>
          </button>
          <Link href="/about" className="flex flex-col items-center justify-center py-3 px-2 min-w-0 flex-1">
            <Users className="h-6 w-6 mb-1" style={{ color: pathname === '/about' ? '#DC143C' : '#1F2937' }} />
            <span className="text-[10px] font-semibold" style={{ color: pathname === '/about' ? '#DC143C' : '#374151' }}>About</span>
          </Link>
          <Link href="/blog" className="flex flex-col items-center justify-center py-3 px-2 min-w-0 flex-1">
            <Book className="h-6 w-6 mb-1" style={{ color: pathname?.startsWith('/blog') ? '#DC143C' : '#1F2937' }} />
            <span className="text-[10px] font-semibold" style={{ color: pathname?.startsWith('/blog') ? '#DC143C' : '#374151' }}>Blog</span>
          </Link>
          <a
            href="https://wa.me/97517643416"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-2 min-w-0 flex-1"
          >
            <MessageCircle className="h-6 w-6 mb-1" style={{ color: '#25D366' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#059669' }}>WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
