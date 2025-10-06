const pool = require('../config/db');

class AnalyticsRepository {
  static async getSalesByMonth() {
    const res = await pool.query(
      "SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COALESCE(SUM(total_amount), 0) AS sales FROM orders WHERE payment_status = 'completed' GROUP BY month ORDER BY month"
    );
    return res.rows;
  }

  static async getOrdersByStatus() {
    const res = await pool.query('SELECT order_status, COUNT(*) AS count FROM orders GROUP BY order_status');
    return res.rows;
  }

  static async getTopSellingProducts(limit = 5) {
    const res = await pool.query(
      'SELECT p.title, SUM(oi.quantity) AS total_quantity_sold FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.title ORDER BY total_quantity_sold DESC LIMIT $1',
      [limit]
    );
    return res.rows;
  }
}

module.exports = AnalyticsRepository;
