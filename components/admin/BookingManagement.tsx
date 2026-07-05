'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Mail, Calendar, DollarSign, Users, Check, X, Clock, Download, ChevronDown } from 'lucide-react';

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
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchBookings();
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
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">{bookings.length} bookings</p>
        </div>
        <button
          onClick={() => {/* Export functionality */}}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border hover:bg-gray-50"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-blue-500' },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'bg-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : bookings.length > 0 ? (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Booking #</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tour</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Travel Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Travelers</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Payment</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className="font-medium">{booking.booking_number}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium">{booking.client_name}</div>
                        <div className="text-sm text-gray-500">{booking.client_email}</div>
                        {booking.client_phone && (
                          <div className="text-xs text-gray-400">{booking.client_phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">{booking.tour?.title}</div>
                      <div className="text-xs text-gray-500 capitalize">{booking.tour?.category}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(booking.travel_date)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        {booking.total_travelers}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">${booking.total_amount.toLocaleString()}</div>
                      {booking.deposit_amount > 0 && (
                        <div className="text-xs text-gray-500">
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
                        <div className="text-xs text-gray-400 mt-1">Deposit pending</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetailModal(booking)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${booking.client_email}`, '_blank')}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* Quick Actions Dropdown */}
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                            <div className="py-2">
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                                Confirm
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Check className="w-4 h-4 text-blue-600" />
                                Mark Complete
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <X className="w-4 h-4 text-red-600" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">Bookings will appear here once customers start booking tours</p>
        </div>
      )}
    </div>

    {/* Booking Detail Modal */}
    {showDetailModal && selectedBooking && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Booking Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Booking Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Booking Number</span>
                  <p className="font-medium">{selectedBooking.booking_number}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Booking Date</span>
                  <p className="font-medium">{formatDate(selectedBooking.created_at)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Payment Status</span>
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
                  <span className="text-sm text-gray-500">Name</span>
                  <p className="font-medium">{selectedBooking.client_name}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="font-medium">{selectedBooking.client_email}</p>
                  </div>
                  {selectedBooking.client_phone && (
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="font-medium">{selectedBooking.client_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tour Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Tour Information</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold mb-2">{selectedBooking.tour?.title}</p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Category</span>
                    <p className="capitalize">{selectedBooking.tour?.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration</span>
                    <p>{selectedBooking.tour?.duration} days</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Travel Date</span>
                    <p>{formatDate(selectedBooking.travel_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Pricing Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="font-bold text-lg">${selectedBooking.total_amount.toLocaleString()}</span>
                </div>
                {selectedBooking.deposit_amount > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Deposit Required</span>
                    <span className="font-medium">${selectedBooking.deposit_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-500">Deposit Paid</span>
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
          <div className="p-6 border-t bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={() => window.open(`mailto:${selectedBooking.client_email}`, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-100"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </button>
              <button
                onClick={() => {/* Download invoice */}}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-100"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
}