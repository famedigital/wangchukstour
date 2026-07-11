'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          // Try to refresh token
          console.log('Auth check failed, trying to refresh token...');
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
          });

          if (!refreshResponse.ok) {
            router.push('/admin/login');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="ml-3">Loading...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create New Blog Post</h1>
            <p className="text-gray-500 mt-1">Write and publish your new article</p>
          </div>
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>

        {/* Editor */}
        <BlogEditor isNewPost={true} onCancel={handleCancel} />
      </div>
    </AdminLayout>
  );
}
