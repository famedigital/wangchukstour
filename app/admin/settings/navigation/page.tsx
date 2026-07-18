'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { SEOManagement } from '@/components/admin/SEOManagement';

export default function NavigationSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">SEO & Navigation Meta</h1>
          <p className="text-gray-500 mt-1">
            Site-wide SEO settings. Tour submenu categories are managed under Tours.
          </p>
        </div>
        <SEOManagement />
      </div>
    </AdminLayout>
  );
}
