import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function readUrl(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') {
    const t = v.trim();
    return t && t !== '#' ? t : null;
  }
  if (typeof v === 'object' && v !== null && 'value' in v) {
    return readUrl((v as { value: unknown }).value);
  }
  const t = String(v).trim();
  return t && t !== '#' ? t : null;
}

/**
 * Public Facebook / Instagram URLs for the site footer.
 * Reads flat keys and the nested Admin → SEO → Social Media blob (`seo_settings`).
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ facebook: null, instagram: null });
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['social_facebook', 'social_instagram', 'seo_settings']);

    const map = Object.fromEntries((data || []).map((row) => [row.key, row.value]));

    let seoBlob: Record<string, unknown> = {};
    const rawSeo = map.seo_settings;
    if (rawSeo && typeof rawSeo === 'object' && !Array.isArray(rawSeo)) {
      seoBlob = rawSeo as Record<string, unknown>;
    } else if (typeof rawSeo === 'string') {
      try {
        const parsed = JSON.parse(rawSeo);
        if (parsed && typeof parsed === 'object') seoBlob = parsed;
      } catch {
        // ignore invalid JSON
      }
    }

    const facebook =
      readUrl(map.social_facebook) ||
      readUrl(seoBlob.social_facebook) ||
      null;
    const instagram =
      readUrl(map.social_instagram) ||
      readUrl(seoBlob.social_instagram) ||
      null;

    return NextResponse.json(
      { facebook, instagram },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Public social API error:', error);
    return NextResponse.json({ facebook: null, instagram: null });
  }
}
