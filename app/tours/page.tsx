import { getAllTours } from '@/lib/database';
import { ToursPageClient } from './ToursPageClient';

export default async function ToursPage() {
  // Fetch all tours on server
  const tours = await getAllTours();

  // Pass to client component for filtering
  return <ToursPageClient tours={tours} />;
}
