const pool = require('../config/db');

class AdminBannerRepository {
  static async getBanner() {
    const res = await pool.query('SELECT * FROM banner LIMIT 1');
    return res.rows[0];
  }

  static async createBanner({ message, isActive }) {
    const res = await pool.query(
      'INSERT INTO banner (message, is_active) VALUES ($1, $2) RETURNING * ',
      [message, isActive]
    );
    return res.rows[0];
  }

  static async updateBanner(id, { message, isActive }) {
    const res = await pool.query(
      'UPDATE banner SET message = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING * ',
      [message, isActive, id]
    );
    return res.rows[0];
  }

  static async toggleBanner(id, isActive) {
    const res = await pool.query(
      'UPDATE banner SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING * ',
      [isActive, id]
    );
    return res.rows[0];
  }
}

module.exports = AdminBannerRepository;
