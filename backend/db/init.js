const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const waitForDatabase = async (maxRetries = 10, delayMs = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connection successful!');
      return true;
    } catch (err) {
      console.log(`Waiting for database... (attempt ${i + 1}/${maxRetries})`);
      if (i < maxRetries - 1) {
        await sleep(delayMs);
      } else {
        throw new Error(err.message);
      }
    }
  }
};

const initializeDatabase = async () => {
  try {
    // Wait for database to be ready
    await waitForDatabase();
    
    // Initialize schema
    const schemaPath = path.resolve(__dirname, './schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database schema:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
};

module.exports = initializeDatabase;