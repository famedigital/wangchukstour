import { Suspense } from 'react';
import { getAllTours } from '@/lib/database';
import { ToursPageClient } from './ToursPageClient';

// Always fetch fresh tours after admin edits (avoid stale Vercel/RSC cache)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading tours...</div>}>
      <ToursPageClient tours={tours} />
    </Suspense>
  );
}
