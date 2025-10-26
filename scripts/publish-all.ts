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

async function publishAllPosts() {
  console.log('📢 Publishing all draft posts...\n');

  try {
    // Check drafts before
    const draftsBefore = await pool.query('SELECT COUNT(*) FROM posts WHERE published = false');
    console.log(`Found ${draftsBefore.rows[0].count} draft post(s)\n`);

    if (parseInt(draftsBefore.rows[0].count) === 0) {
      console.log('✅ All posts are already published!');
      await pool.end();
      return;
    }

    // Get draft post titles
    const drafts = await pool.query('SELECT id, title FROM posts WHERE published = false');
    console.log('Posts to be published:');
    drafts.rows.forEach(post => {
      console.log(`  - [${post.id}] ${post.title}`);
    });
    console.log();

    // Publish all drafts
    const result = await pool.query(`
      UPDATE posts
      SET published = true, updated_at = CURRENT_TIMESTAMP
      WHERE published = false
      RETURNING id, title
    `);

    console.log(`✅ Successfully published ${result.rows.length} post(s):`);
    result.rows.forEach(post => {
      console.log(`  ✓ [${post.id}] ${post.title}`);
    });

    // Verify
    const publishedCount = await pool.query('SELECT COUNT(*) FROM posts WHERE published = true');
    console.log(`\n📊 Total published posts: ${publishedCount.rows[0].count}`);

    await pool.end();
    console.log('\n🎉 Done! Visit http://localhost:3000 to see your posts!\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

publishAllPosts();
