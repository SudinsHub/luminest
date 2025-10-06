const pool = require('../config/db');

class OrderRepository {
  static async createOrder({
    order_number,
    customer_id,
    customer_name,
    delivery_address,
    customer_contact,
    customer_email,
    subtotal,
    delivery_charge,
    discount_amount,
    coupon_id,
    total_amount,
    payment_method,
    payment_status,
    order_status,
    notes,
  }) {
    const res = await pool.query(
      'INSERT INTO orders (order_number, customer_id, customer_name, delivery_address, customer_contact, customer_email, subtotal, delivery_charge, discount_amount, coupon_id, total_amount, payment_method, payment_status, order_status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING * ',
      [
        order_number,
        customer_id,
        customer_name,
        delivery_address,
        customer_contact,
        customer_email,
        subtotal,
        delivery_charge,
        discount_amount,
        coupon_id,
        total_amount,
        payment_method,
        payment_status,
        order_status,
        notes,
      ]
    );
    return res.rows[0];
  }

  static async createOrderItem({
    order_id,
    product_id,
    quantity,
    unit_price,
    total_price,
  }) {
    const res = await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
      [order_id, product_id, quantity, unit_price, total_price]
    );
    return res.rows[0];
  }

  static async getOrdersByCustomerId(customerId) {
    const res = await pool.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC', [customerId]);
    return res.rows;
  }

  static async getOrderById(orderId, customerId) {
    const res = await pool.query('SELECT * FROM orders WHERE id = $1 AND customer_id = $2', [orderId, customerId]);
    return res.rows[0];
  }

  static async getOrderItems(orderId) {
    const res = await pool.query(
      'SELECT oi.id, oi.product_id, p.title, p.images[1] as image, oi.quantity, oi.unit_price, oi.total_price FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
      [orderId]
    );
    return res.rows;
  }

  static async updateProductStock(productId, quantityChange) {
    await pool.query(
      'UPDATE products SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantityChange, productId]
    );
  }
}

module.exports = OrderRepository;
