'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PremiumInput, PremiumTextarea } from '@/components/ui/premium-input';
import { Send, Check } from 'lucide-react';

export function ContactForm() {
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent') || 'inquire';
  const tourSlug = searchParams.get('tour') || '';
  const tourTitle = searchParams.get('title') || '';

  const isBooking = intent === 'book';

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    travelDates: '',
    groupSize: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (tourTitle || tourSlug) {
      setFormState((prev) => ({
        ...prev,
        message: prev.message
          ? prev.message
          : isBooking
            ? `I would like to book: ${tourTitle || tourSlug}.\nPreferred dates / group details:`
            : `I have a question about: ${tourTitle || tourSlug}.\n\n`,
      }));
    }
  }, [tourTitle, tourSlug, isBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['name', 'email', 'message'];
    const errors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!formState[field as keyof typeof formState]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);

      const endpoint = isBooking ? '/api/booking-request' : '/api/contact';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          intent,
          tourSlug,
          tourTitle,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({
          name: '',
          email: '',
          phone: '',
          travelDates: '',
          groupSize: '',
          message: '',
        });
        setFormErrors({});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isBooking ? 'Booking request sent!' : 'Message sent!'}
        </h3>
        <p className="text-muted-foreground">
          {isBooking
            ? 'Our team will confirm availability and get back to you within 24 hours.'
            : "Thank you for reaching out. We'll get back to you within 24 hours."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {isBooking ? (
          <p>
            <span className="font-medium text-foreground">Booking request</span>
            {tourTitle ? ` for ${tourTitle}` : ''}. This creates a pending booking for our team to confirm.
          </p>
        ) : (
          <p>
            <span className="font-medium text-foreground">General inquiry</span>
            {tourTitle ? ` about ${tourTitle}` : ''}. We typically reply within 24 hours.
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <PremiumInput
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Your full name"
            error={formErrors.name}
          />
          {formErrors.name && <p className="text-destructive text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <PremiumInput
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="you@email.com"
            error={formErrors.email}
          />
          {formErrors.email && <p className="text-destructive text-sm mt-1">{formErrors.email}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <PremiumInput
            type="tel"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            placeholder="+975 ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Group size</label>
          <PremiumInput
            type="text"
            name="groupSize"
            value={formState.groupSize}
            onChange={handleChange}
            placeholder="e.g. 2 adults"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Preferred travel dates</label>
        <PremiumInput
          type="text"
          name="travelDates"
          value={formState.travelDates}
          onChange={handleChange}
          placeholder="e.g. Oct 2026"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message *</label>
        <PremiumTextarea
          name="message"
          value={formState.message}
          onChange={handleChange}
          placeholder="Tell us about your trip..."
          rows={5}
          error={formErrors.message}
        />
        {formErrors.message && <p className="text-destructive text-sm mt-1">{formErrors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {submitting ? 'Sending...' : isBooking ? 'Submit booking request' : 'Send inquiry'}
      </button>
    </form>
  );
}
