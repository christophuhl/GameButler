import 'dotenv/config';  // Add this at the top
import pg from 'pg';
const { Pool } = pg;

// Create a new pool using environment variables
// this only works when the pool values here are defined
// probably because the .env file is not being read
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true
  }
});

async function testConnection() {
  try {
    // Test basic connection
    console.log('Using pool:', pool);
    const result = await pool.query('SELECT NOW()');
    console.log('Successfully connected to PostgreSQL!');
    console.log('Current timestamp from DB:', result.rows[0].now);

    // Test Gamelist table
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Games'
      );
    `);
    console.log('Gamelist table exists:', tableCheck.rows[0].exists);

    // If table exists, show its structure
    if (tableCheck.rows[0].exists) {
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Games';
      `);
      console.log('\nTable structure:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
    }
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

testConnection(); 