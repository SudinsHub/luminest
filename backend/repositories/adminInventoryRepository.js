const pool = require('../config/db');

class AdminInventoryRepository {
  static async getAllInventory() {
    const res = await pool.query('SELECT id, title, stock_quantity, price FROM products ORDER BY title ASC');
    return res.rows;
  }

  static async updateProductStock(productId, stockQuantity) {
    const res = await pool.query(
      'UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, title, stock_quantity, price',
      [stockQuantity, productId]
    );
    return res.rows[0];
  }

  static async getLowStockProducts(threshold = 10) {
    const res = await pool.query(
      'SELECT id, title, stock_quantity, price FROM products WHERE stock_quantity <= $1 ORDER BY stock_quantity ASC',
      [threshold]
    );
    return res.rows;
  }
}

module.exports = AdminInventoryRepository;
