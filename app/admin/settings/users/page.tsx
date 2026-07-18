'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManager } from '@/components/admin/UserManager';

export default function UsersSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-gray-500 mt-1">Manage admin accounts and roles</p>
        </div>
        <UserManager />
      </div>
    </AdminLayout>
  );
}
