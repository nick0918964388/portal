import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initDatabase } from '@/lib/init-db';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// GET all posts
export async function GET() {
  try {
    await ensureDbInitialized();

    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST new post
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();

    const body = await request.json();
    const { title, slug, excerpt, content, cover_image, author, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO posts (title, slug, excerpt, content, cover_image, author, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, slug, excerpt || '', content, cover_image || null, author || 'Admin', published || false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);

    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
