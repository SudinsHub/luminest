require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;


pool.connect((err) => {
  if (err) {
    console.error('Database connection error', err);
    return;
  }
  console.log('Connected to PostgreSQL database');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
