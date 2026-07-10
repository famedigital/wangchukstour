import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, Tag, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const optimizeImageUrl = (url: string | undefined, width: number, height: number) => {
  if (!url) return '/placeholder.jpg';
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch blog post from database
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/blog?slug=${slug}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    notFound();
  }

  const data = await response.json();
  const blog = data.post;

  if (!blog) {
    notFound();
  }

  // Fetch related posts by category
  const relatedResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/blog?category=${blog.category}&limit=3`, {
    cache: 'no-store'
  });

  let relatedPosts = [];
  if (relatedResponse.ok) {
    const relatedData = await relatedResponse.json();
    relatedPosts = (relatedData.posts || []).filter((post: any) => post.id !== blog.id).slice(0, 3);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl(blog.featured_image_url, 1920, 1080)}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="mx-auto max-w-4xl">
              <Badge
                className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                style={{
                  background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                  color: '#FFFFFF'
                }}
              >
                {blog.category}
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg">
                <div className="flex items-center gap-3 font-medium">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-3 font-medium">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)' }}>
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span>{format(new Date(blog.published_at), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-3 font-medium">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #B91C1C 0%, #8B0000 100%)' }}>
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="mb-10 flex flex-wrap gap-3">
                  {blog.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-4 py-2 text-sm font-semibold"
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {blog.content.split('\n').map((paragraph, i) => {
                  // Handle headings
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={i} className="font-heading text-3xl md:text-4xl font-bold mt-12 mb-6" style={{ color: 'var(--prayer-red)' }}>
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={i} className="font-heading text-4xl md:text-5xl font-bold mt-12 mb-6">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }

                  // Handle lists
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-8 text-lg">
                        {paragraph.replace('- ', '')}
                      </li>
                    );
                  }

                  // Handle bold
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={i} className="font-bold text-xl mt-6 mb-6">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }

                  // Regular paragraph
                  if (paragraph.trim()) {
                    return (
                      <p key={i} className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Share */}
              <div className="mt-16 pt-10 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div>
                    <p className="font-bold text-xl mb-2">Share this article</p>
                    <p className="text-muted-foreground">
                      Help others discover Bhutan
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                      border: 'none'
                    }}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Share
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <Card className="shadow-lg">
                <CardContent className="p-10">
                  <div className="flex gap-6 items-start">
                    <div className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-lg shrink-0">
                      <img
                        src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782912162/thimphu-moonsoon_dftrcz.jpg', 200, 200)}
                        alt={blog.author}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-prayer-red/20 to-monastery-red/20" />
                    </div>
                    <div>
                      <p className="font-bold text-xl mb-2">Written by {blog.author}</p>
                      <p className="text-muted-foreground text-lg leading-relaxed">{blog.author_bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <div className="mx-auto max-w-5xl">
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Related Articles</h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-3 h-full">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={optimizeImageUrl(post.featured_image_url, 600, 400)}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <Badge
                            className="absolute top-5 right-5 border-0 font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                              color: '#FFFFFF'
                            }}
                          >
                            {post.category}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-heading font-bold text-lg mb-3 line-clamp-2 group-hover:text-prayer-red transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911256/buddhapoint_z2kucc.jpg', 1920, 1080)}
              alt="Buddha Point"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/85" />
          </div>

          <div className="relative container text-center">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Inspired to Visit Bhutan?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              Let us help you plan your journey through the Land of the Thunder Dragon.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/tours">
                <MagneticButton
                  className="rounded-xl px-10 py-6 text-lg font-semibold"
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--prayer-red)',
                    border: 'none'
                  }}
                >
                  Explore Our Tours
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>
              <Link href="/contact">
                <MagneticButton
                  className="rounded-xl px-10 py-6 text-lg font-semibold border-2"
                  style={{
                    background: 'transparent',
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF'
                  }}
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
