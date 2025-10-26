import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool from '@/lib/db';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE slug = $1 AND published = true',
      [slug]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Blog
            </Link>
            <Link href="/admin" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cover Image */}
        {post.cover_image && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          <span className="font-medium">{post.author}</span>
          <span>•</span>
          <time>{new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</time>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-4 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
