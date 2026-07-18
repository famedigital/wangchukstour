'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Search } from 'lucide-react';
import { toast } from 'sonner';

type Inquiry = {
  id: string;
  name?: string;
  client_name?: string;
  email?: string;
  client_email?: string;
  phone?: string;
  client_phone?: string;
  message?: string;
  status?: string;
  created_at?: string;
};

export function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== 'all') params.set('status', status);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/inquiries?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const updateStatus = async (id: string, next: string) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Status updated');
      await load();
      window.dispatchEvent(new Event('admin-badges-refresh'));
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search inquiries..."
            className="w-full min-h-11 pl-10 pr-4 rounded-xl border border-gray-200"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-h-11 px-3 rounded-xl border border-gray-200"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
        <button
          type="button"
          onClick={load}
          className="min-h-11 px-4 rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" /> Loading...
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border border-dashed rounded-2xl">
          <Mail className="h-10 w-10 mx-auto mb-2 opacity-40" />
          No inquiries yet
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((item) => {
            const name = item.name || item.client_name || 'Unknown';
            const email = item.email || item.client_email || '';
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 space-y-2"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                  <select
                    value={item.status || 'new'}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="min-h-11 px-3 rounded-xl border border-gray-200"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
