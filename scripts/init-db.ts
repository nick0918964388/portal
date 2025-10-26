import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config({ path: '.env.local' });

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Test connection
    console.log('📡 Testing connection...');
    const client = await pool.connect();
    console.log('✓ Connected successfully!\n');

    // Create posts table
    console.log('📋 Creating posts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        cover_image VARCHAR(500),
        author VARCHAR(100) DEFAULT 'Admin',
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Posts table created!\n');

    // Create indexes
    console.log('📇 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
      CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
    `);
    console.log('✓ Indexes created!\n');

    // Check if we already have posts
    const countResult = await client.query('SELECT COUNT(*) FROM posts');
    const postCount = parseInt(countResult.rows[0].count);

    if (postCount === 0) {
      console.log('📝 Inserting sample blog posts...');

      // Insert sample posts
      const samplePosts = [
        {
          title: 'Welcome to My Portfolio Blog',
          slug: 'welcome-to-my-portfolio-blog',
          excerpt: 'This is the first post on my new portfolio blog. Learn about what you can expect to find here.',
          content: `Welcome to my portfolio blog!

I'm excited to share my journey, projects, and thoughts with you through this platform. This blog will be a place where I document my learning experiences, showcase my projects, and share insights about web development.

What to expect:
- Technical tutorials and guides
- Project showcases and case studies
- Industry insights and trends
- Personal reflections on software development

Stay tuned for more content!`,
          cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
          published: true,
        },
        {
          title: 'Building Modern Web Applications with Next.js',
          slug: 'building-modern-web-applications-with-nextjs',
          excerpt: 'Discover how Next.js makes it easy to build fast, scalable web applications with React.',
          content: `Next.js has revolutionized the way we build React applications. In this post, I'll share my experience using Next.js for building modern web applications.

Key Features:
1. Server-Side Rendering (SSR)
2. Static Site Generation (SSG)
3. API Routes
4. File-based routing
5. Image optimization
6. Built-in CSS support

Why I love Next.js:
- Performance out of the box
- Great developer experience
- Excellent documentation
- Active community

If you're considering Next.js for your next project, I highly recommend giving it a try!`,
          cover_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
          published: true,
        },
        {
          title: 'TypeScript Best Practices for 2024',
          slug: 'typescript-best-practices-2024',
          excerpt: 'Learn the latest TypeScript best practices to write safer, more maintainable code.',
          content: `TypeScript continues to evolve, and with it, our best practices. Here are some tips for writing better TypeScript code in 2024.

Best Practices:

1. Use Strict Mode
   Enable strict mode in tsconfig.json for better type safety.

2. Avoid 'any' Type
   Use 'unknown' instead when the type is truly unknown.

3. Leverage Type Inference
   Let TypeScript infer types when possible.

4. Use Utility Types
   Partial, Required, Pick, Omit, etc.

5. Define Interfaces for Objects
   Clear contracts make code more maintainable.

Remember: TypeScript is not just about adding types, it's about writing better JavaScript!`,
          cover_image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
          published: true,
        },
        {
          title: 'Upcoming Project: E-commerce Platform',
          slug: 'upcoming-project-ecommerce-platform',
          excerpt: 'A sneak peek at my next big project - a full-featured e-commerce platform.',
          content: `I'm working on something exciting - a modern e-commerce platform built with the latest technologies.

Tech Stack:
- Next.js 16
- TypeScript
- Tailwind CSS
- PostgreSQL
- Stripe for payments
- AWS for hosting

Features in development:
- Product catalog
- Shopping cart
- User authentication
- Order management
- Payment processing
- Admin dashboard

This is still a work in progress. Stay tuned for updates!`,
          cover_image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=400&fit=crop',
          published: false,
        },
      ];

      for (const post of samplePosts) {
        await client.query(
          `INSERT INTO posts (title, slug, excerpt, content, cover_image, published)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [post.title, post.slug, post.excerpt, post.content, post.cover_image, post.published]
        );
        console.log(`  ✓ Added: "${post.title}"`);
      }

      console.log(`\n✓ ${samplePosts.length} sample posts inserted!\n`);
    } else {
      console.log(`ℹ️  Database already has ${postCount} post(s). Skipping sample data.\n`);
    }

    // Summary
    const finalCount = await client.query('SELECT COUNT(*) FROM posts');
    const publishedCount = await client.query('SELECT COUNT(*) FROM posts WHERE published = true');

    console.log('📊 Database Summary:');
    console.log(`   Total posts: ${finalCount.rows[0].count}`);
    console.log(`   Published: ${publishedCount.rows[0].count}`);
    console.log(`   Drafts: ${parseInt(finalCount.rows[0].count) - parseInt(publishedCount.rows[0].count)}`);

    client.release();
    await pool.end();

    console.log('\n✅ Database initialization complete!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Visit: http://localhost:3000');
    console.log('  3. Admin: http://localhost:3000/admin');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    process.exit(1);
  }
}

initializeDatabase();
