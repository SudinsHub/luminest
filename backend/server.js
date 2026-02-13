require('dotenv').config();
const app = require('./app');
const initializeDatabase = require('./db/init');

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();