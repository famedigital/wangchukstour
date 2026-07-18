'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Compass, Users, Book, MessageCircle, ChevronDown } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const baseNavLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Blog', href: '/blog', icon: Book },
  { name: 'Contact', href: '/contact', icon: MessageCircle },
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
      .catch(() =>
        setTourCategories([
          { name: 'International Tour', slug: 'international' },
          { name: 'Regional Tour', slug: 'regional' },
        ])
      );
  }, []);

  const isToursActive = pathname === '/tours' || pathname.startsWith('/tours');
  const navSolid = !mounted || scrolled;

  const desktopLink = (active?: boolean) =>
    cn(
      'rounded-md px-4 py-2 text-sm font-medium transition-colors',
      navSolid
        ? active
          ? 'text-primary'
          : 'text-foreground/80 hover:text-primary'
        : active
          ? 'text-accent'
          : 'text-white/90 hover:text-white'
    );

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 right-0 left-0 z-50 hidden transition-[background-color,box-shadow,backdrop-filter] duration-300 lg:block',
          navSolid ? 'border-b border-border/60 bg-card/95 shadow-sm backdrop-blur-md' : 'bg-transparent'
        )}
      >
        <div className="container flex h-16 items-center justify-between xl:h-[4.5rem]">
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/hckgrdeh/image/upload/v1782962660/wangchukstlogo_usxclz.png"
              alt="Wangchuks Tours & Treks"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] xl:h-12"
            />
          </Link>

          <div className="flex items-center gap-0.5">
            <Link href="/" className={desktopLink(pathname === '/')}>
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setToursOpen(true)}
              onMouseLeave={() => setToursOpen(false)}
            >
              <button
                type="button"
                className={cn(desktopLink(isToursActive), 'inline-flex items-center gap-1')}
                onClick={() => setToursOpen((v) => !v)}
              >
                Tours <ChevronDown className={cn('size-3.5 transition-transform', toursOpen && 'rotate-180')} />
              </button>
              {toursOpen && (
                <div className="absolute top-full left-0 min-w-[13rem] pt-2">
                  <div className="overflow-hidden rounded-lg border border-border bg-card py-1.5 shadow-lg">
                    <Link
                      href="/tours"
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary"
                    >
                      All Tours
                    </Link>
                    {tourCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/tours?category=${cat.slug}`}
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {baseNavLinks
              .filter((l) => l.name !== 'Home')
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={desktopLink(
                    link.href === '/blog'
                      ? pathname?.startsWith('/blog')
                      : pathname === link.href
                  )}
                >
                  {link.name}
                </Link>
              ))}

            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'ml-3 h-9 rounded-md bg-accent px-4 text-accent-foreground hover:bg-accent/90'
              )}
            >
              Get Quote
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="safe-area-inset-bottom fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-card/95 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden">
        {mobileToursOpen && (
          <div className="grid grid-cols-2 gap-2 border-b border-border bg-card px-3 py-2.5">
            <Link
              href="/tours"
              onClick={() => setMobileToursOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-md bg-muted text-sm font-medium text-foreground"
            >
              All Tours
            </Link>
            {tourCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tours?category=${cat.slug}`}
                onClick={() => setMobileToursOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-md bg-muted px-2 text-center text-sm font-medium text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        <div className="mx-auto flex max-w-lg flex-row">
          <Link href="/" className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5">
            <Home className={cn('mb-0.5 size-5', pathname === '/' ? 'text-primary' : 'text-muted-foreground')} />
            <span
              className={cn(
                'text-[10px] font-semibold',
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Home
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileToursOpen((v) => !v)}
            className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5"
          >
            <Compass
              className={cn(
                'mb-0.5 size-5',
                isToursActive || mobileToursOpen ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-semibold',
                isToursActive || mobileToursOpen ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Tours
            </span>
          </button>
          <Link href="/about" className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5">
            <Users
              className={cn('mb-0.5 size-5', pathname === '/about' ? 'text-primary' : 'text-muted-foreground')}
            />
            <span
              className={cn(
                'text-[10px] font-semibold',
                pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              About
            </span>
          </Link>
          <Link href="/blog" className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5">
            <Book
              className={cn(
                'mb-0.5 size-5',
                pathname?.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-semibold',
                pathname?.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Blog
            </span>
          </Link>
          <a
            href="https://wa.me/97517643416"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5"
          >
            <MessageCircle className="mb-0.5 size-5 text-emerald-600" />
            <span className="text-[10px] font-semibold text-emerald-700">WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
