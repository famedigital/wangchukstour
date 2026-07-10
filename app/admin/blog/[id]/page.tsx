'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await response.json();
        if (!data.user) {
          router.push('/admin/login');
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const postId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            onClick={handleCancel}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        </div>
        <BlogEditor postId={postId} onCancel={handleCancel} />
      </div>
    </div>
  );
}
