import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Mountain, Mail, Phone, MapPin, MessageCircle, Camera, Video } from 'lucide-react';

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Mountain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-heading font-bold">Wangchuk Tours & Treks</span>
                <span className="text-xs text-secondary-foreground/70">
                  Discover the Last Shangri-La
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-secondary-foreground/80">
              Experience authentic Bhutan with Wangchuk Tours & Treks. We craft personalized journeys
              through the Land of the Thunder Dragon, combining cultural immersion with
              breathtaking natural beauty.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-foreground/10 text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Tours</h3>
            <ul className="space-y-3">
              {footerLinks.tours.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-secondary-foreground/20" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-secondary-foreground/80">
                Thimphu, Bhutan
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <a
                href="mailto:info@wangchuktour.com"
                className="text-sm text-secondary-foreground/80 hover:text-primary"
              >
                info@wangchuktour.com
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Phone</p>
              <a
                href="tel:+97517111111"
                className="text-sm text-secondary-foreground/80 hover:text-primary"
              >
                +975 17 111 111
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-secondary-foreground/20" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} Wangchuk Tours & Treks. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-secondary-foreground/60 transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-secondary-foreground/60 transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
