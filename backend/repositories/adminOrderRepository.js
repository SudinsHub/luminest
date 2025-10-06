const pool = require('../config/db');

class AdminOrderRepository {
  static async getAllOrders() {
    const res = await pool.query('SELECT o.*, c.name as customer_name, c.email as customer_email FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.created_at DESC');
    return res.rows;
  }

  static async getOrderById(id) {
    const res = await pool.query(
      'SELECT o.*, c.name as customer_name, c.email as customer_email FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = $1',
      [id]
    );
    return res.rows[0];
  }

  static async updateOrderStatus(id, status) {
    const res = await pool.query(
      'UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING * ',
      [status, id]
    );
    return res.rows[0];
  }

  static async getOrderItems(orderId) {
    const res = await pool.query(
      'SELECT oi.id, oi.product_id, p.title, oi.quantity, oi.unit_price, oi.total_price FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
      [orderId]
    );
    return res.rows;
  }
}

module.exports = AdminOrderRepository;
