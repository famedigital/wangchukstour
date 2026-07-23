import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { MapPin } from 'lucide-react';
import { FooterContact } from '@/components/public/FooterContact';
import { FooterSocial } from '@/components/public/FooterSocial';

const footerLinks = {
  explore: [
    { name: 'Tours', href: '/tours' },
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  tours: [
    { name: 'Cultural Tours', href: '/tours?category=cultural' },
    { name: 'Trekking', href: '/tours?category=trekking' },
    { name: 'Festival Tours', href: '/tours?category=festival' },
    { name: 'Custom Tours', href: '/tours?category=custom' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about#story' },
    { name: 'Team', href: '/about#team' },
    { name: 'Careers', href: '/contact' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Travel Info', href: '/travel-info' },
    { name: 'Booking Policy', href: '/policy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-secondary text-secondary-foreground">
      <div className="container py-14 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <Link href="/" className="group mb-5 flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/hckgrdeh/image/upload/v1782962660/wangchukstlogo_usxclz.png"
                alt="Wangchuks Tours & Treks"
                className="h-12 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-heading text-lg font-semibold">Wangchuks Tours & Treks</span>
                <span className="text-xs text-secondary-foreground/60">
                  Discover the Last Shangri-La
                </span>
              </div>
            </Link>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-secondary-foreground/75">
              Experience authentic Bhutan with Wangchuks Tours & Treks. We craft personalized journeys
              through the Land of the Thunder Dragon, combining cultural immersion with
              breathtaking natural beauty.
            </p>

            <FooterSocial />
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {(
              [
                ['Explore', footerLinks.explore],
                ['Tours', footerLinks.tours],
                ['Company', footerLinks.company],
                ['Support', footerLinks.support],
              ] as const
            ).map(([title, links]) => (
              <div key={title}>
                <h3 className="mb-4 font-heading text-sm font-semibold tracking-wide text-secondary-foreground">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-secondary-foreground/70 transition-colors hover:text-accent"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://innovates.bt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-secondary-foreground/50 transition-colors hover:text-accent"
          >
            Designed by innovates.bt
          </a>
        </div>

        <Separator className="my-8 bg-secondary-foreground/15" />

        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm">
            <p className="text-secondary-foreground/50">
              © {new Date().getFullYear()} Wangchuks Tours & Treks. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <FooterContact />
              <a
                href="https://maps.app.goo.gl/augGCB49iedQwe398"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-secondary-foreground/60 transition-colors hover:text-accent"
              >
                <MapPin className="h-4 w-4" />
                Thimphu, Bhutan
              </a>
            </div>
          </div>

          <div className="flex gap-6 text-xs md:text-sm">
            <Link
              href="/privacy"
              className="text-secondary-foreground/60 transition-colors hover:text-accent"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-secondary-foreground/60 transition-colors hover:text-accent"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
