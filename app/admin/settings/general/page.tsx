'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContactSettingsForm } from '@/components/admin/forms/ContactSettingsForm';
import { CrmAlertsForm } from '@/components/admin/forms/CrmAlertsForm';

export default function GeneralSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">General & Contact Settings</h1>
          <p className="mt-1 text-gray-500">Contact details, CRM alerts, and general site settings</p>
        </div>
        <CrmAlertsForm />
        <ContactSettingsForm />
      </div>
    </AdminLayout>
  );
}
