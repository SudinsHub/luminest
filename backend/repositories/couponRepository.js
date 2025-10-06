const pool = require('../config/db');

class CouponRepository {
  static async findByCode(code) {
    const res = await pool.query('SELECT * FROM coupons WHERE code = $1', [code]);
    return res.rows[0];
  }

  static async incrementUsedCount(id) {
    await pool.query('UPDATE coupons SET used_count = used_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }

  // Add other coupon-related database operations here as needed
}

module.exports = CouponRepository;
