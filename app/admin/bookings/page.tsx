'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, Check, Loader2 } from 'lucide-react';

export default function BookingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Bookings</h1>
            <p className="text-gray-500 mt-1">View and manage tour bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300 bg-white">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)', color: 'white' }}>
              <Check className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Booking Management Coming Soon</p>
              <p className="text-sm">This feature is currently under development. Check back later!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}