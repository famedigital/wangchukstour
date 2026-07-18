'use client';

import ReactMarkdown from 'react-markdown';

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl prose-img:shadow-md">
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === 'string' ? src : undefined}
              alt={alt || 'Blog image'}
              className="w-full h-auto rounded-xl my-6 object-cover"
              loading="lazy"
            />
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          p: ({ children }) => <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5">{children}</p>,
          h1: ({ children }) => <h1 className="font-heading text-3xl md:text-4xl font-bold mt-10 mb-4 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="font-heading text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="font-heading text-xl md:text-2xl font-semibold mt-8 mb-3 text-foreground">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-muted-foreground">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-muted-foreground">{children}</ol>,
          li: ({ children }) => <li className="text-base md:text-lg leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">{children}</blockquote>
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
