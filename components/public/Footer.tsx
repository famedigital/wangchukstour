import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, MessageCircle, Camera, Video } from 'lucide-react';

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

const socialLinks = [
  { name: 'Facebook', href: '#', icon: MessageCircle },
  { name: 'Instagram', href: '#', icon: Camera },
  { name: 'YouTube', href: '#', icon: Video },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* First Column: Logo, Description, Social Media */}
          <div>
            <Link href="/" className="group flex items-center space-x-3 transition-transform hover:scale-105 mb-4">
              <div className="relative h-14 w-auto transition-transform duration-300">
                <img
                  src="https://res.cloudinary.com/hckgrdeh/image/upload/v1782962660/wangchukstlogo_usxclz.png"
                  alt="Wangchuks Tours & Treks"
                  className="h-full w-auto object-contain"
                  style={{ maxHeight: '56px' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-heading font-bold">Wangchuks Tours & Treks</span>
                <span className="text-xs text-secondary-foreground/70">
                  Discover the Last Shangri-La
                </span>
              </div>
            </Link>
            <p className="text-sm text-secondary-foreground/80 mb-6">
              Experience authentic Bhutan with Wangchuks Tours & Treks. We craft personalized journeys
              through the Land of the Thunder Dragon, combining cultural immersion with
              breathtaking natural beauty.
            </p>

            {/* Social Media Icons - Next Row */}
            <div className="flex flex-row items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="group flex items-center gap-2 rounded-full bg-secondary-foreground/10 px-4 py-2 text-sm text-secondary-foreground transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{social.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Second Column: 4 Category Menu - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div>
              <h3 className="font-heading font-semibold mb-3 text-sm">Explore</h3>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/80 transition-all hover:translate-x-1 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold mb-3 text-sm">Tours</h3>
              <ul className="space-y-2">
                {footerLinks.tours.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/80 transition-all hover:translate-x-1 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold mb-3 text-sm">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/80 transition-all hover:translate-x-1 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold mb-3 text-sm">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/80 transition-all hover:translate-x-1 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Credit */}
        <div className="text-center">
          <a
            href="https://innovates.bt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-secondary-foreground/60 transition-all hover:translate-x-1 hover:text-primary"
          >
            Designed by innovates.bt
          </a>
        </div>

        <Separator className="my-6 bg-secondary-foreground/20" />

        {/* Copyright with Email, Phone, and Address - Desktop optimized */}
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm">
            <p className="text-secondary-foreground/60">
              © {new Date().getFullYear()} Wangchuks Tours & Treks. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:info@wangchuktour.com"
                className="flex items-center gap-2 text-secondary-foreground/60 transition-all hover:translate-x-1 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                info@wangchuktour.com
              </a>
              <a
                href="tel:+97517643416"
                className="flex items-center gap-2 text-secondary-foreground/60 transition-all hover:translate-x-1 hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                +975 17643416
              </a>
              <a
                href="https://maps.app.goo.gl/augGCB49iedQwe398"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-secondary-foreground/60 transition-all hover:translate-x-1 hover:text-primary"
              >
                <MapPin className="h-4 w-4" />
                Thimphu, Bhutan
              </a>
            </div>
          </div>

          <div className="flex gap-6 text-xs md:text-sm">
            <Link
              href="/privacy"
              className="text-secondary-foreground/60 transition-all hover:translate-x-1 hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-secondary-foreground/60 transition-all hover:translate-x-1 hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
