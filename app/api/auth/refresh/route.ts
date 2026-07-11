import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken, verifyToken } from '@/lib/auth/jwt';
import { createClient } from '@/utils/supabase/server';
import type { AdminUser } from '@/lib/auth/rbac';

export async function POST(request: NextRequest) {
  try {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      console.warn('Failed to refresh access token');
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Verify the new token to get user info
    const payload = verifyToken(newAccessToken);
    if (!payload) {
      console.warn('Failed to verify new access token');
      return NextResponse.json(
        { error: 'Failed to verify new token' },
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
      console.error('Database error fetching user during refresh:', error);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user in RBAC-compatible format
    const adminUser: AdminUser = {
      id: user.id,
      email: user.email,
      name: user.name || 'Admin',
      role: user.role || 'admin',
      permissions: user.permissions || [],
    };

    return NextResponse.json({
      user: adminUser,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}