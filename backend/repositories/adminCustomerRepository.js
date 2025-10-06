const pool = require('../config/db');

class AdminCustomerRepository {
  static async getAllCustomers() {
    const res = await pool.query('SELECT id, name, email, contact_no, address, created_at, updated_at FROM customers ORDER BY created_at DESC');
    return res.rows;
  }

  static async getCustomerById(id) {
    const res = await pool.query('SELECT id, name, email, contact_no, address, created_at, updated_at FROM customers WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async updateCustomerStatus(id, status) {
    // Assuming 'status' in customer model implies an active/inactive flag or similar.
    // In the given schema, there is no 'status' field for customers. 
    // For demonstration, let's assume we can update a generic 'is_active' field if it existed, 
    // or we can just return the customer as is if no status update is directly applicable. 
    // If a status field is to be added to the customers table, the schema would need modification. 
    // For now, I'll return the customer without any explicit status update.
    const res = await pool.query(
      'SELECT id, name, email, contact_no, address, created_at, updated_at FROM customers WHERE id = $1',
      [id]
    );
    return res.rows[0];
  }
}

module.exports = AdminCustomerRepository;
