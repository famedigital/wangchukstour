import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
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