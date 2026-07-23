import { createClient } from '@/utils/supabase/server'
import {
  DEFAULT_COMPANY_NAME,
  DEFAULT_COMPANY_TAGLINE,
} from '@/lib/brand-defaults'

export { DEFAULT_COMPANY_NAME, DEFAULT_COMPANY_TAGLINE } from '@/lib/brand-defaults'

function asCleanName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const t = value.trim()
  return t || null
}

function nameFromSeoBlob(raw: unknown): string | null {
  if (!raw) return null
  let obj: Record<string, unknown> | null = null
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>
  } else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') obj = parsed as Record<string, unknown>
    } catch {
      return null
    }
  }
  if (!obj) return null
  return asCleanName(obj.site_name)
}

/**
 * Company / brand name from CRM:
 * Admin → SEO & Site Settings → Site Name
 * (seo_settings.site_name, mirrored to flat site_name)
 */
export async function getCompanyName(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_name', 'seo_settings'])

    const map = Object.fromEntries((data || []).map((row) => [row.key, row.value]))

    return (
      asCleanName(map.site_name) ||
      nameFromSeoBlob(map.seo_settings) ||
      DEFAULT_COMPANY_NAME
    )
  } catch (err) {
    console.error('[getCompanyName]', err)
    return DEFAULT_COMPANY_NAME
  }
}

export async function getCompanyTagline(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_tagline', 'seo_settings'])

    const map = Object.fromEntries((data || []).map((row) => [row.key, row.value]))
    const flat = asCleanName(map.site_tagline)
    if (flat) return flat

    const blob = map.seo_settings
    if (blob && typeof blob === 'object' && !Array.isArray(blob)) {
      const t = asCleanName((blob as Record<string, unknown>).site_tagline)
      if (t) return t
    }
    return DEFAULT_COMPANY_TAGLINE
  } catch {
    return DEFAULT_COMPANY_TAGLINE
  }
}

export type BrandInfo = {
  name: string
  tagline: string
}

export async function getBrand(): Promise<BrandInfo> {
  const [name, tagline] = await Promise.all([getCompanyName(), getCompanyTagline()])
  return { name, tagline }
}
