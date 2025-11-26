const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

const initializeDatabase = async () => {
  try {
    const schemaPath = path.resolve(__dirname, './schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database schema:', err.stack);
  } finally {
    await pool.end();
  }
};

initializeDatabase();
