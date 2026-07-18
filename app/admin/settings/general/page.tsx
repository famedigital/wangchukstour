'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContactSettingsForm } from '@/components/admin/forms/ContactSettingsForm';

export default function GeneralSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">General & Contact Settings</h1>
          <p className="text-gray-500 mt-1">Contact details and general site settings</p>
        </div>
        <ContactSettingsForm />
      </div>
    </AdminLayout>
  );
}
