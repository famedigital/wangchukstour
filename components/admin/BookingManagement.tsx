'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Mail, Calendar, Users, Check, X, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  booking_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  tour_id: string;
  tour: {
    title: string;
    category: string;
    duration: number;
  };
  number_of_adults: number;
  number_of_children: number;
  total_travelers: number;
  travel_date: string;
  total_amount: number;
  deposit_amount: number;
  deposit_paid: boolean;
  payment_status: string;
  status: string;
  assigned_to?: string;
  created_at: string;
}

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus, filterDateFrom, filterDateTo, searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchQuery) params.append('search', searchQuery);
      if (filterDateFrom) params.append('date_from', filterDateFrom);
      if (filterDateTo) params.append('date_to', filterDateTo);

      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/bookings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await fetchBookings();
      window.dispatchEvent(new Event('admin-badges-refresh'));
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const openDetailModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      case 'completed':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'partial':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'refunded':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const inputClassName =
    'flex h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30';

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">{bookings.length} bookings</p>
        </div>
        <Button type="button" variant="outline" onClick={() => {/* Export functionality */}}>
          <Download className="w-5 h-5" />
          Export CSV
        </Button>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={inputClassName}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className={inputClassName}
          />
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className={inputClassName}
          />
        </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-blue-500' },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'bg-red-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : bookings.length > 0 ? (
        <Card className="overflow-hidden py-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Booking #</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Client</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Tour</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Travel Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Travelers</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Payment</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <span className="font-medium">{booking.booking_number}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium">{booking.client_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.client_email}</div>
                        {booking.client_phone && (
                          <div className="text-xs text-muted-foreground/70">{booking.client_phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">{booking.tour?.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{booking.tour?.category}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(booking.travel_date)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {booking.total_travelers}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">${booking.total_amount.toLocaleString()}</div>
                      {booking.deposit_amount > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Deposit: ${booking.deposit_amount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                      {booking.deposit_amount > 0 && !booking.deposit_paid && (
                        <div className="text-xs text-muted-foreground/70 mt-1">Deposit pending</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDetailModal(booking)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => window.open(`mailto:${booking.client_email}`, '_blank')}
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
                            title="Quick actions"
                          >
                            <Edit className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                              <Check className="w-4 h-4 text-green-600" />
                              Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'completed')}>
                              <Check className="w-4 h-4 text-blue-600" />
                              Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                              <X className="w-4 h-4 text-destructive" />
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
          <p className="text-muted-foreground">Bookings will appear here once customers start booking tours</p>
          </CardContent>
        </Card>
      )}
    </div>

    {/* Booking Detail Modal */}
    {showDetailModal && selectedBooking && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowDetailModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Booking Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Booking Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Booking Number</span>
                  <p className="font-medium">{selectedBooking.booking_number}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Booking Date</span>
                  <p className="font-medium">{formatDate(selectedBooking.created_at)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPaymentStatusColor(selectedBooking.payment_status)}`}>
                    {selectedBooking.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Client Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Name</span>
                  <p className="font-medium">{selectedBooking.client_name}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Email</span>
                    <p className="font-medium">{selectedBooking.client_email}</p>
                  </div>
                  {selectedBooking.client_phone && (
                    <div>
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <p className="font-medium">{selectedBooking.client_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tour Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Tour Information</h3>
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="font-semibold mb-2">{selectedBooking.tour?.title}</p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category</span>
                    <p className="capitalize">{selectedBooking.tour?.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration</span>
                    <p>{selectedBooking.tour?.duration} days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Travel Date</span>
                    <p>{formatDate(selectedBooking.travel_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Pricing Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="font-bold text-lg">${selectedBooking.total_amount.toLocaleString()}</span>
                </div>
                {selectedBooking.deposit_amount > 0 && (
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Deposit Required</span>
                    <span className="font-medium">${selectedBooking.deposit_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">Deposit Paid</span>
                  <span className="font-medium">
                    {selectedBooking.deposit_paid ? (
                      <Check className="w-5 h-5 text-green-600 inline" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600 inline" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border bg-muted/40">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => window.open(`mailto:${selectedBooking.client_email}`, '_blank')}
              >
                <Mail className="w-5 h-5" />
                Send Email
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {/* Download invoice */}}
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )}
  </>
);
}