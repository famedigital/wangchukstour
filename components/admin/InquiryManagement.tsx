'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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

const selectClassName =
  'flex h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30';

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search inquiries..."
            className="min-h-11 pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClassName}
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
        <Button type="button" onClick={load} className="min-h-11">
          Search
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" /> Loading...
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
          <Mail className="h-10 w-10 mx-auto mb-2 opacity-40" />
          No inquiries yet
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((item) => {
            const name = item.name || item.client_name || 'Unknown';
            const email = item.email || item.client_email || '';
            return (
              <Card key={item.id}>
                <CardContent className="p-4 md:p-5 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{name}</p>
                      <p className="text-sm text-muted-foreground">{email}</p>
                      <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                      </p>
                    </div>
                    <select
                      value={item.status || 'new'}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className={selectClassName}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
