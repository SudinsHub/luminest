const pool = require('../config/db');

class Admin {
  static async create({ name, email, password }) {
    const res = await pool.query(
      'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING * ',
      [name, email, password]
    );
    return res.rows[0];
  }

  static async findByEmail(email) {
    const res = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    return res.rows[0];
  }

  static async findById(id) {
    const res = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async update(id, { name, email, password }) {
    const res = await pool.query(
      'UPDATE admins SET name = $1, email = $2, password = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING * ',
      [name, email, password, id]
    );
    return res.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM admins WHERE id = $1', [id]);
  }
}

module.exports = Admin;
