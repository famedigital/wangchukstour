/** Shared Contact CMS shape + defaults (admin General & Contact settings). */

export type ContactInfo = {
  email: string
  phone: string
  address: string
  whatsapp?: string
}

export type ContactContent = {
  hero?: {
    title?: string
    subtitle?: string
    backgroundImage?: string
  }
  contactInfo: ContactInfo
  officeHours?: {
    weekdays?: string
    saturdays?: string
    sundays?: string
  }
  socialMedia?: Record<string, string | undefined>
}

export const CONTACT_INFO_DEFAULTS: ContactInfo = {
  email: 'info@wangchuktour.com',
  phone: '+975 17643416',
  address: 'Thimphu, Bhutan',
  whatsapp: '+97517643416',
}

export const CONTACT_DEFAULTS: ContactContent = {
  hero: {
    title: 'Contact Us',
    subtitle: "We're here to help you plan your perfect Bhutanese adventure",
    backgroundImage:
      'https://res.cloudinary.com/hckgrdeh/image/upload/v1782965945/punakhadzong_xkcrcu.jpg',
  },
  contactInfo: { ...CONTACT_INFO_DEFAULTS },
  officeHours: {
    weekdays: '9:00 AM - 6:00 PM',
    saturdays: '10:00 AM - 4:00 PM',
    sundays: 'Closed',
  },
  socialMedia: {},
}

export function mergeContactContent(raw: unknown): ContactContent {
  const incoming =
    raw && typeof raw === 'object' ? (raw as Partial<ContactContent>) : {}
  const info: Partial<ContactInfo> =
    incoming.contactInfo && typeof incoming.contactInfo === 'object'
      ? incoming.contactInfo
      : {}

  return {
    ...CONTACT_DEFAULTS,
    ...incoming,
    contactInfo: {
      ...CONTACT_INFO_DEFAULTS,
      ...info,
      email: String(info.email || CONTACT_INFO_DEFAULTS.email).trim() || CONTACT_INFO_DEFAULTS.email,
      phone: String(info.phone || CONTACT_INFO_DEFAULTS.phone).trim() || CONTACT_INFO_DEFAULTS.phone,
      address:
        String(info.address || CONTACT_INFO_DEFAULTS.address).trim() ||
        CONTACT_INFO_DEFAULTS.address,
      whatsapp:
        String(info.whatsapp || CONTACT_INFO_DEFAULTS.whatsapp || '').trim() ||
        CONTACT_INFO_DEFAULTS.whatsapp,
    },
  }
}

/** Build a tel: href from a display phone number. */
export function phoneToTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '')
  return cleaned ? `tel:${cleaned}` : 'tel:'
}

/**
 * First WhatsApp number from CRM Contact Settings.
 * Supports values like "+97517643416 / +97517645738".
 */
export function parsePrimaryWhatsApp(whatsapp?: string | null): string {
  const raw = String(whatsapp || '').trim()
  if (!raw) return ''

  const parts = raw.split(/[/|,;]+|\bor\b/i)
  for (const part of parts) {
    const digits = part.replace(/[^\d]/g, '')
    // E.164-ish: country code + local, typically 8–15 digits
    if (digits.length >= 8 && digits.length <= 15) return digits
  }

  const fallback = raw.replace(/[^\d]/g, '')
  return fallback.length >= 8 && fallback.length <= 15 ? fallback : ''
}

/** Build https://wa.me/... from CRM WhatsApp field. */
export function whatsappToHref(whatsapp?: string | null): string {
  const digits =
    parsePrimaryWhatsApp(whatsapp) ||
    parsePrimaryWhatsApp(CONTACT_INFO_DEFAULTS.whatsapp)
  return `https://wa.me/${digits}`
}
