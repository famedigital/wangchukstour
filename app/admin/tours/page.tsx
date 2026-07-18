'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { TourManagement } from '@/components/admin/TourManagement';
import { TourCategoryManager } from '@/components/admin/TourCategoryManager';

export default function ToursPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Tours</h1>
          <p className="text-gray-500 mt-1">
            Categories power the public Tours submenu. Assign each tour to a category below.
          </p>
        </div>
        <TourCategoryManager />
        <TourManagement />
      </div>
    </AdminLayout>
  );
}
