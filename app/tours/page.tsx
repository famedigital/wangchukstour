import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllTours } from '@/lib/database';
import { ToursPageClient } from './ToursPageClient';
import { buildSocialMetadata, SITE_NAME } from '@/lib/seo';

// Always fetch fresh tours after admin edits (avoid stale Vercel/RSC cache)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = buildSocialMetadata({
  title: `Tours & Journeys | ${SITE_NAME}`,
  description:
    'Browse Bhutan tour packages — cultural immersions, treks, and festival experiences with Wangchuks Tours & Treks.',
  path: '/tours',
});

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading tours...</div>}>
      <ToursPageClient tours={tours} />
    </Suspense>
  );
}
