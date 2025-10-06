const pool = require('../config/db');

class ProductRepository {
  static async findById(id) {
    const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return res.rows[0];
  }

  // Add other product-related database operations here as needed
}

module.exports = ProductRepository;
