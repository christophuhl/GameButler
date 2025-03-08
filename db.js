import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

// Create a new pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: true
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to PostgreSQL');
  }
});

// Generic GET function
const get = async (table, conditions = {}) => {
  try {
    // Build WHERE clause if conditions exist
    let whereClause = '';
    let values = [];
    let paramCount = 1;

    if (Object.keys(conditions).length > 0) {
      whereClause = 'WHERE ' + Object.keys(conditions)
        .map(key => {
          values.push(conditions[key]);
          return `${key} = $${paramCount++}`;
        })
        .join(' AND ');
    }

    // Construct and execute query
    const query = `SELECT * FROM ${table} ${whereClause}`;
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error executing GET query:', error);
    throw error;
  }
};

// Generic POST function
const post = async (table, fieldsJson) => {
  try {
    // Build INSERT query
    const query = `INSERT INTO ${table} (${fieldsJson.map(field => field.name).join(', ')}) VALUES (${fieldsJson.map((_, i) => `$${i + 1}`).join(', ')})`;  
    const result = await pool.query(query, fieldsJson.map(field => field.value));
    return result.rows[0];
  } catch (error) {
    console.error('Error executing POST query:', error);
    throw error;
  }
};

// Generic PUT function
const put = async (table, fieldsJson, conditions = {}) => {
  try {
    // Build UPDATE query
    const query = `UPDATE ${table} SET ${fieldsJson.map(field => `${field.name} = $${field.value}`).join(', ')} WHERE ${Object.keys(conditions).join(' AND ')}`;  
    const result = await pool.query(query, fieldsJson.map(field => field.value));
    return result.rows[0];
  } catch (error) {
    console.error('Error executing PUT query:', error);
    throw error;
  }
};    

// Generic DELETE function
const del = async (table, conditions = {}) => {
  try {
    // Build DELETE query
    const query = `DELETE FROM ${table} WHERE ${Object.keys(conditions).join(' AND ')}`;
    const result = await pool.query(query, Object.values(conditions));
    return result.rows[0];
  } catch (error) {
    console.error('Error executing DELETE query:', error);  
    throw error;
  }
};

export { get, post, put, del, pool };