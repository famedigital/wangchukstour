'use client';

import { useState } from 'react';
import { PremiumInput, PremiumTextarea } from '@/components/ui/premium-input';
import { Send, Check } from 'lucide-react';

export function ContactForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    const errors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!formState[field as keyof typeof formState]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = 'Please enter a valid email address';
    }

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
        setFormErrors({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <PremiumInput
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="your@email.com"
            error={formErrors.email}
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <PremiumInput
            type="tel"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Travel Dates</label>
          <PremiumInput
            type="text"
            name="travelDates"
            value={formState.travelDates}
            onChange={handleChange}
            placeholder="e.g., March 2025, flexible dates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Group Size</label>
          <PremiumInput
            type="text"
            name="groupSize"
            value={formState.groupSize}
            onChange={handleChange}
            placeholder="e.g., 2 adults, solo traveler"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message *</label>
        <PremiumTextarea
          name="message"
          value={formState.message}
          onChange={handleChange}
          placeholder="Tell us about your dream Bhutan adventure..."
          rows={5}
          error={formErrors.message}
        />
        {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
      >
        {submitting ? (
          <>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}