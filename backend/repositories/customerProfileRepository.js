const pool = require('../config/db');

class CustomerProfileRepository {
  static async getCustomerProfile(customerId) {
    const res = await pool.query(
      'SELECT id, name, address, contact_no, email, created_at, updated_at FROM customers WHERE id = $1',
      [customerId]
    );
    return res.rows[0];
  }

  static async updateCustomerProfile(customerId, { name, address, contact_no, email }) {
    const res = await pool.query(
      'UPDATE customers SET name = $1, address = $2, contact_no = $3, email = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, name, address, contact_no, email, created_at, updated_at',
      [name, address, contact_no, email, customerId]
    );
    return res.rows[0];
  }

  static async deleteCustomerAccount(customerId) {
    await pool.query('DELETE FROM customers WHERE id = $1', [customerId]);
  }
}

module.exports = CustomerProfileRepository;
