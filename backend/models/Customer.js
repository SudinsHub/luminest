const pool = require('../config/db');

class Customer {
  static async create({ name, address, contact_no, email, password, google_id }) {
    const res = await pool.query(
      'INSERT INTO customers (name, address, contact_no, email, password, google_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ',
      [name, address, contact_no, email, password, google_id]
    );
    return res.rows[0];
  }

  static async findByEmail(email) {
    const res = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    return res.rows[0];
  }

  static async findById(id) {
    const res = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async findByGoogleId(google_id) {
    const res = await pool.query('SELECT * FROM customers WHERE google_id = $1', [google_id]);
    return res.rows[0];
  }

  static async update(id, { name, address, contact_no, email, password }) {
    const res = await pool.query(
      'UPDATE customers SET name = $1, address = $2, contact_no = $3, email = $4, password = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING * ',
      [name, address, contact_no, email, password, id]
    );
    return res.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
  }
}

module.exports = Customer;
