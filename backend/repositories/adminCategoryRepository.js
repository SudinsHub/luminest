const pool = require('../config/db');

class AdminCategoryRepository {
  static async createCategory({ name, slug, description, imageUrl }) {
    const res = await pool.query(
      'INSERT INTO categories (name, slug, description, image_url) VALUES ($1, $2, $3, $4) RETURNING * ',
      [name, slug, description, imageUrl]
    );
    return res.rows[0];
  }

  static async getAllCategories() {
    const res = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return res.rows;
  }

  static async getCategoryById(id) {
    const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async updateCategory(id, { name, slug, description, imageUrl }) {
    const res = await pool.query(
      'UPDATE categories SET name = $1, slug = $2, description = $3, image_url = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING * ',
      [name, slug, description, imageUrl, id]
    );
    return res.rows[0];
  }

  static async deleteCategory(id) {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  }
}

module.exports = AdminCategoryRepository;
