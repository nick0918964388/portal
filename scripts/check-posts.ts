import { config } from 'dotenv';
config({ path: '.env.local' });

import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function checkPosts() {
  console.log('=== Checking Posts in Database ===\n');

  try {
    // Count total posts
    const totalResult = await pool.query('SELECT COUNT(*) FROM posts');
    console.log('Total posts:', totalResult.rows[0].count);

    // Count published posts
    const publishedResult = await pool.query('SELECT COUNT(*) FROM posts WHERE published = true');
    console.log('Published posts:', publishedResult.rows[0].count);

    // Count draft posts
    const draftResult = await pool.query('SELECT COUNT(*) FROM posts WHERE published = false');
    console.log('Draft posts:', draftResult.rows[0].count);
    console.log();

    // List all posts with details
    const allPosts = await pool.query(`
      SELECT id, title, slug, published, created_at,
             CASE WHEN excerpt IS NULL OR excerpt = '' THEN 'No excerpt' ELSE 'Has excerpt' END as excerpt_status,
             CASE WHEN cover_image IS NULL OR cover_image = '' THEN 'No image' ELSE 'Has image' END as image_status
      FROM posts
      ORDER BY created_at DESC
    `);

    console.log('All Posts in Database:');
    console.log('─'.repeat(80));

    if (allPosts.rows.length === 0) {
      console.log('❌ No posts found in database!');
      console.log('\nPlease run: npm run db:init');
      console.log('Or create posts at: http://localhost:3000/admin');
    } else {
      allPosts.rows.forEach((post, index) => {
        console.log(`\n${index + 1}. [ID: ${post.id}] ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Status: ${post.published ? '✅ PUBLISHED' : '📝 DRAFT'}`);
        console.log(`   Created: ${new Date(post.created_at).toLocaleString()}`);
        console.log(`   Excerpt: ${post.excerpt_status}`);
        console.log(`   Image: ${post.image_status}`);
      });
      console.log('\n' + '─'.repeat(80));

      // Check what homepage query would return
      console.log('\n📄 Posts that WILL show on homepage (published = true):');
      const homepagePosts = await pool.query(`
        SELECT id, title, slug, excerpt, cover_image, author, created_at
        FROM posts
        WHERE published = true
        ORDER BY created_at DESC
      `);

      if (homepagePosts.rows.length === 0) {
        console.log('❌ No published posts found!');
        console.log('\n💡 Solution: Set posts to published status');
        console.log('   1. Go to http://localhost:3000/admin');
        console.log('   2. Edit each post');
        console.log('   3. Check "Publish immediately"');
        console.log('   4. Click "Update Post"');
        console.log('\n   OR run this SQL:');
        console.log('   UPDATE posts SET published = true WHERE id IN (1,2,3);');
      } else {
        console.log(`✅ Found ${homepagePosts.rows.length} published post(s):`);
        homepagePosts.rows.forEach(post => {
          console.log(`   - ${post.title}`);
        });
      }
    }

    await pool.end();
    console.log('\n✅ Check complete!\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPosts();
