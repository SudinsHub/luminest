const pool = require('../config/db');

class DashboardRepository {
  static async getTotalSales() {
    const res = await pool.query("SELECT COALESCE(SUM(total_amount), 0) AS total_sales FROM orders WHERE payment_status = 'completed'");
    return parseFloat(res.rows[0].total_sales);
  }

  static async getTotalOrders() {
    const res = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
    return parseInt(res.rows[0].total_orders);
  }

  static async getTotalCustomers() {
    const res = await pool.query('SELECT COUNT(*) AS total_customers FROM customers');
    return parseInt(res.rows[0].total_customers);
  }

  static async getProductsOutOfStock() {
    const res = await pool.query('SELECT COUNT(*) AS out_of_stock_products FROM products WHERE stock_quantity = 0');
    return parseInt(res.rows[0].out_of_stock_products);
  }

  static async getRecentOrders(limit = 5) {
    const res = await pool.query(
      'SELECT id, order_number, customer_name, total_amount, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return res.rows;
  }
}

module.exports = DashboardRepository;
