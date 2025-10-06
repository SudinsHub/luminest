const pool = require('../config/db');

class AdminCouponRepository {
  static async createCoupon({ code, type, value, max_discount, min_order_amount, category_id, product_id, is_active, valid_from, valid_until, usage_limit }) {
    const res = await pool.query(
      'INSERT INTO coupons (code, type, value, max_discount, min_order_amount, category_id, product_id, is_active, valid_from, valid_until, usage_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING * ',
      [code, type, value, max_discount, min_order_amount, category_id, product_id, is_active, valid_from, valid_until, usage_limit]
    );
    return res.rows[0];
  }

  static async getAllCoupons() {
    const res = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
    return res.rows;
  }

  static async getCouponById(id) {
    const res = await pool.query('SELECT * FROM coupons WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async updateCoupon(id, { code, type, value, max_discount, min_order_amount, category_id, product_id, is_active, valid_from, valid_until, usage_limit }) {
    const res = await pool.query(
      'UPDATE coupons SET code = $1, type = $2, value = $3, max_discount = $4, min_order_amount = $5, category_id = $6, product_id = $7, is_active = $8, valid_from = $9, valid_until = $10, usage_limit = $11, updated_at = CURRENT_TIMESTAMP WHERE id = $12 RETURNING * ',
      [code, type, value, max_discount, min_order_amount, category_id, product_id, is_active, valid_from, valid_until, usage_limit, id]
    );
    return res.rows[0];
  }

  static async deleteCoupon(id) {
    await pool.query('DELETE FROM coupons WHERE id = $1', [id]);
  }

  static async getCouponUsageStats(id) {
    const res = await pool.query(
      'SELECT used_count, usage_limit FROM coupons WHERE id = $1',
      [id]
    );
    return res.rows[0];
  }
}

module.exports = AdminCouponRepository;
