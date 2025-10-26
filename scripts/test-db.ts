import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config({ path: '.env.local' });

// Create pool after loading env vars
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function initDatabase() {
  const client = await pool.connect();

  try {
    // Create posts table
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

    // Create index on slug for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    `);

    // Create index on published for filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function testConnection() {
  console.log('=== Database Connection Test ===\n');
  console.log('Configuration:');
  console.log('  Host:', process.env.DATABASE_HOST);
  console.log('  Port:', process.env.DATABASE_PORT);
  console.log('  Database:', process.env.DATABASE_NAME);
  console.log('  User:', process.env.DATABASE_USER);
  console.log();

  try {
    // Test connection
    console.log('Connecting to PostgreSQL...');
    const client = await pool.connect();
    console.log('✓ Successfully connected to PostgreSQL!\n');

    // Check server version
    const versionResult = await client.query('SELECT version()');
    console.log('PostgreSQL version:');
    console.log(' ', versionResult.rows[0].version.split(',')[0]);
    console.log();

    client.release();

    // Initialize database
    console.log('Initializing database tables...');
    await initDatabase();
    console.log('✓ Database tables created!\n');

    // Check if posts table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'posts'
      );
    `);
    console.log('Posts table exists:', tableCheck.rows[0].exists);

    // Count posts
    const countResult = await pool.query('SELECT COUNT(*) FROM posts');
    console.log('Number of posts:', countResult.rows[0].count);
    console.log();

    // List all posts
    const postsResult = await pool.query('SELECT id, title, published, created_at FROM posts ORDER BY created_at DESC');
    console.log('Existing posts:');
    if (postsResult.rows.length === 0) {
      console.log('  (no posts yet - database is ready for new posts!)');
    } else {
      postsResult.rows.forEach(post => {
        const date = new Date(post.created_at).toLocaleDateString();
        console.log(`  - [${post.id}] ${post.title} (${post.published ? 'Published' : 'Draft'}) - ${date}`);
      });
    }

    await pool.end();
    console.log('\n✓ Database is ready to use!');
    console.log('\nNext steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Visit: http://localhost:3000/admin');
    console.log('  3. Create your first blog post!');

  } catch (error: any) {
    console.error('\n✗ Database connection error:');
    console.error('  Message:', error.message);
    if (error.code) {
      console.error('  Code:', error.code);
    }
    console.log('\nPlease check:');
    console.log('  1. Database server is running');
    console.log('  2. Host and port are correct');
    console.log('  3. Username and password are correct');
    console.log('  4. Database exists');
    console.log('  5. Firewall allows connections');
    process.exit(1);
  }
}

testConnection();
