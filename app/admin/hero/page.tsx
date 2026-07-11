'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { HeroSlidesManagement } from '@/components/admin/HeroSlidesManagement';

export default function HeroSlidesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold">Hero Slides</h1>
          <p className="text-gray-500 mt-1">Manage homepage hero slider content</p>
        </div>

        {/* Hero Slides Management */}
        <HeroSlidesManagement />
      </div>
    </AdminLayout>
  );
}