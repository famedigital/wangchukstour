import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const payload = await getCurrentUser();

    if (!payload) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get full user data from database
    const supabase = await createClient();

    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, avatar_url, permissions, is_active, email_verified, created_at')
      .eq('id', payload.userId)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}