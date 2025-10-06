const pool = require('../config/db');

class CartRepository {
  static async getCartItems(customerId) {
    const res = await pool.query(
      'SELECT c.id, c.product_id, p.title, p.price, p.images[1] as image, c.quantity FROM carts c JOIN products p ON c.product_id = p.id WHERE c.customer_id = $1',
      [customerId]
    );
    return res.rows;
  }

  static async addCartItem(customerId, productId, quantity) {
    const res = await pool.query(
      'INSERT INTO carts (customer_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (customer_id, product_id) DO UPDATE SET quantity = carts.quantity + $3, updated_at = CURRENT_TIMESTAMP RETURNING * ',
      [customerId, productId, quantity]
    );
    return res.rows[0];
  }

  static async updateCartItem(itemId, customerId, quantity) {
    const res = await pool.query(
      'UPDATE carts SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND customer_id = $3 RETURNING * ',
      [quantity, itemId, customerId]
    );
    return res.rows[0];
  }

  static async removeCartItem(itemId, customerId) {
    await pool.query('DELETE FROM carts WHERE id = $1 AND customer_id = $2', [itemId, customerId]);
  }

  static async clearCart(customerId) {
    await pool.query('DELETE FROM carts WHERE customer_id = $1', [customerId]);
  }

  static async getCartItemById(itemId, customerId) {
    const res = await pool.query('SELECT * FROM carts WHERE id = $1 AND customer_id = $2', [itemId, customerId]);
    return res.rows[0];
  }
}

module.exports = CartRepository;
