'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { PremiumInput, PremiumTextarea } from '@/components/ui/premium-input';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Users,
  Mountain,
  Check,
  ArrowRight,
  MessageCircle,
  Compass,
  Book,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    travelDates: '',
    groupSize: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=contact');
      const data = await response.json();

      if (response.ok) {
        setContent(data.content);
      } else {
        throw new Error('Failed to load content');
      }
    } catch (err) {
      console.error('Error fetching Contact content:', err);
      setError('Failed to load Contact page content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = content?.formFields?.requiredFields || ['name', 'email', 'message'];
    const errors: Record<string, string> = {};

    requiredFields.forEach((field: string) => {
      if (!formState[field as keyof typeof formState]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({
          name: '',
          email: '',
          phone: '',
          travelDates: '',
          groupSize: '',
          message: ''
        });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const optimizeImageUrl = (url: string, width: number, height: number) => {
    if (!url) return '';
    if (url.includes('cloudinary')) {
      const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
      return url.replace('/image/upload/', `/image/upload/${transformations}/`);
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DC143C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative text-center">
            {/* Animated Compass/Cardinal Points */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full"
                   style={{
                     background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                     animation: 'pulse 2s ease-in-out infinite'
                   }}
              />
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" style={{ color: '#DC143C' }} />
              </div>
            </div>

            {/* Loading Text with Animation */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Connecting With Us</h2>
              <p className="text-gray-500">Opening channels of communication...</p>

              {/* Animated Dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Failed to load content'}</p>
            <button
              onClick={fetchContactContent}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-lg font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { hero, contactInfo, officeHours, socialMedia, formFields } = content;

  const benefits = [
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Bhutanese-owned and operated since 2010',
    },
    {
      icon: Mountain,
      title: 'Personalized Service',
      description: 'Every tour tailored to your interests',
    },
    {
      icon: Check,
      title: 'Sustainable Tourism',
      description: 'Committed to preserving Bhutan\'s environment',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always available during your journey',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={optimizeImageUrl(hero?.backgroundImage || 'https://res.cloudinary.com/hckgrdeh/image/upload/v1782911338/paro-rimpungdzong_uemj9o.jpg', 1920, 1080)}
              alt={hero?.title || 'Contact Us'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/20 via-transparent to-transparent" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-20">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-3xl text-center">
                <Badge
                  className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  Contact
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 text-white">
                  {hero?.title || 'Get in Touch'}
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                  {hero?.subtitle || "We're here to help you plan your perfect Bhutanese adventure"}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="py-8 bg-muted/30 border-b">
          <div className="container">
            <StaggerChildren>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <ScrollReveal key={index} delay={index * 100}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{
                            background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)'
                          }}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <ScrollReveal>
                  <div className="mb-8">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                      Send Us a Message
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>
                </ScrollReveal>

                {submitted ? (
                  <Card className="shadow-premium-md">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-premium-md">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {formFields?.showName !== false && (
                          <PremiumInput
                            label="Name"
                            value={formState.name}
                            onChange={(e) => {
                              setFormState({ ...formState, name: e.target.value });
                              setFormErrors({ ...formErrors, name: '' });
                            }}
                            placeholder="Your full name"
                            required={formFields?.requiredFields?.includes('name')}
                            error={formErrors.name}
                          />
                        )}

                        {formFields?.showEmail !== false && (
                          <PremiumInput
                            label="Email"
                            type="email"
                            value={formState.email}
                            onChange={(e) => {
                              setFormState({ ...formState, email: e.target.value });
                              setFormErrors({ ...formErrors, email: '' });
                            }}
                            placeholder="your@email.com"
                            required={formFields?.requiredFields?.includes('email')}
                            error={formErrors.email}
                          />
                        )}

                        {formFields?.showPhone !== false && (
                          <PremiumInput
                            label="Phone"
                            type="tel"
                            value={formState.phone}
                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                            placeholder="+975 2 327654"
                            required={formFields?.requiredFields?.includes('phone')}
                          />
                        )}

                        {formFields?.showTravelDates !== false && (
                          <PremiumInput
                            label="Preferred Travel Dates"
                            value={formState.travelDates}
                            onChange={(e) => setFormState({ ...formState, travelDates: e.target.value })}
                            placeholder="e.g., March 15-25, 2024"
                          />
                        )}

                        {formFields?.showGroupSize !== false && (
                          <PremiumInput
                            label="Group Size"
                            value={formState.groupSize}
                            onChange={(e) => setFormState({ ...formState, groupSize: e.target.value })}
                            placeholder="Number of travelers"
                          />
                        )}

                        {formFields?.showMessage !== false && (
                          <PremiumTextarea
                            label="Message"
                            value={formState.message}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                              setFormState({ ...formState, message: e.target.value });
                              setFormErrors({ ...formErrors, message: '' });
                            }}
                            placeholder="Tell us about your travel plans..."
                            rows={4}
                            required={formFields?.requiredFields?.includes('message')}
                            error={formErrors.message}
                          />
                        )}

                        <MagneticButton
                          type="submit"
                          disabled={submitting}
                          className="w-full rounded-xl px-8 py-4 text-lg font-semibold"
                          style={{
                            background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                            color: '#FFFFFF',
                            border: 'none'
                          }}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </MagneticButton>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <ScrollReveal>
                  <div className="mb-8">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                      Contact Information
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Reach out to us directly through any of these channels
                    </p>
                  </div>
                </ScrollReveal>

                <div className="space-y-6">
                  {/* Phone */}
                  {contactInfo?.phone && (
                    <ScrollReveal>
                      <Card className="hover:shadow-premium-md transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                              style={{
                                background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)'
                              }}
                            >
                              <Phone className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                              <Link href={`tel:${contactInfo.phone}`} className="text-muted-foreground hover:text-prayer-red transition-colors">
                                {contactInfo.phone}
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  )}

                  {/* WhatsApp */}
                  {contactInfo?.whatsapp && (
                    <ScrollReveal>
                      <Card className="hover:shadow-premium-md transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                              style={{ background: '#25D366' }}
                            >
                              <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
                              <Link href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`} className="text-muted-foreground hover:text-prayer-red transition-colors">
                                Chat Now
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  )}

                  {/* Email */}
                  {contactInfo?.email && (
                    <ScrollReveal>
                      <Card className="hover:shadow-premium-md transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                              style={{
                                background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)'
                              }}
                            >
                              <Mail className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                              <Link href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-prayer-red transition-colors">
                                {contactInfo.email}
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  )}

                  {/* Address */}
                  {contactInfo?.address && (
                    <ScrollReveal>
                      <Card className="hover:shadow-premium-md transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                              style={{
                                background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)'
                              }}
                            >
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                              <p className="text-muted-foreground mb-3">
                                {contactInfo.address}
                              </p>
                              <Link
                                href="https://maps.app.goo.gl/augGCB49iedQwe398"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-prayer-red hover:text-monastery-red transition-colors"
                              >
                                <Compass className="h-4 w-4" />
                                Open in Google Maps
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  )}

                  {/* Office Hours */}
                  {officeHours && (
                    <ScrollReveal>
                      <Card className="hover:shadow-premium-md transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                              <Clock className="h-6 w-6 text-foreground" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-3">Office Hours</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Weekdays</span>
                                  <span className="font-medium">{officeHours.weekdays}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Saturdays</span>
                                  <span className="font-medium">{officeHours.saturdays}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Sundays</span>
                                  <span className="font-medium">{officeHours.sundays}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  )}
                </div>

                {/* Social Media */}
                {socialMedia && (
                  <ScrollReveal>
                    <Card className="mt-8 shadow-premium-md">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                          {socialMedia.facebook && (
                            <Link
                              href={socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-blue-100 transition-colors"
                            >
                              <span className="text-blue-600 font-bold text-sm">f</span>
                            </Link>
                          )}
                          {socialMedia.instagram && (
                            <Link
                              href={socialMedia.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-pink-100 transition-colors"
                            >
                              <span className="text-pink-600 font-bold text-sm">ig</span>
                            </Link>
                          )}
                          {socialMedia.twitter && (
                            <Link
                              href={socialMedia.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-blue-100 transition-colors"
                            >
                              <span className="text-blue-400 font-bold text-sm">tw</span>
                            </Link>
                          )}
                          {socialMedia.youtube && (
                            <Link
                              href={socialMedia.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-red-100 transition-colors"
                            >
                              <span className="text-red-600 font-bold text-sm">yt</span>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}