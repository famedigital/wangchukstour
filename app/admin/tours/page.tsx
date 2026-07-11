'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Plus, Loader2, Eye, Edit, Trash2 } from 'lucide-react';

export default function ToursPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Tours</h1>
            <p className="text-gray-500 mt-1">Create and manage your tour packages</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
            <Plus className="h-4 w-4" />
            Add New Tour
          </button>
        </div>

        {/* Content */}
        <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="text-center py-12 text-gray-500">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Tour Management Coming Soon</p>
              <p className="text-sm">This feature is currently under development. Check back later!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}