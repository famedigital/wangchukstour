'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function UsersSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users & Roles</h1>
            <p className="text-gray-500 mt-1">Manage admin users and permissions</p>
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="text-center py-12 text-gray-500">
              <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">User Management Coming Soon</p>
              <p className="text-sm">This feature is currently under development. Check back later!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}