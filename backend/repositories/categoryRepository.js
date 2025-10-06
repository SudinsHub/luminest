const pool = require('../config/db');

class CategoryRepository {
  static async getAllCategories() {
    const res = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return res.rows;
  }

  static async getCategoryById(id) {
    const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return res.rows[0];
  }
}

module.exports = CategoryRepository;
