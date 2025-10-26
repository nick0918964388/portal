import pool from './db';

export async function initDatabase() {
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
