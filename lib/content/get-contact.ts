import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { mergeContactContent, type ContactContent } from '@/lib/content/contact'

function createReadClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}

/** Server-side Contact CMS fetch — same source admin Contact Settings edits. */
export async function getContactPageContent(): Promise<ContactContent> {
  try {
    const supabase = createReadClient()

    let { data, error } = await supabase
      .from('content_pages')
      .select('content, is_active')
      .eq('page_type', 'contact')
      .eq('is_active', true)
      .maybeSingle()

    if (error || !data?.content) {
      const fallback = await supabase
        .from('content_pages')
        .select('content')
        .eq('page_type', 'contact')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (fallback.data?.content) {
        return mergeContactContent(fallback.data.content)
      }

      return mergeContactContent(null)
    }

    return mergeContactContent(data.content)
  } catch (err) {
    console.error('[getContactPageContent]', err)
    return mergeContactContent(null)
  }
}
