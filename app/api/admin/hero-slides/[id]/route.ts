import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { isAuthError, requireAuth } from '@/lib/auth/require-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: slide, error } = await supabase
      .from('hero_slides')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Hero slide update error:', error);
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('Hero slide deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}
