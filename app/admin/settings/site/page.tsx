'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { AboutPageForm } from '@/components/admin/forms/AboutPageForm';

export default function SiteSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Site Content</h1>
          <p className="text-gray-500 mt-1">Edit About page content shown on the public site</p>
        </div>
        <AboutPageForm />
      </div>
    </AdminLayout>
  );
}
