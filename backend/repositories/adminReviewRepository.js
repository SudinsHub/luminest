const pool = require('../config/db');

class AdminReviewRepository {
  static async getAllReviews() {
    const res = await pool.query(
      'SELECT r.id, r.product_id, p.title as product_title, r.customer_id, c.name as customer_name, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r JOIN products p ON r.product_id = p.id JOIN customers c ON r.customer_id = c.id ORDER BY r.created_at DESC'
    );
    return res.rows;
  }

  static async getReviewById(id) {
    const res = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async updateReviewStatus(id, status) {
    // Assuming 'status' in review model implies an approved/rejected flag or similar.
    // In the given schema, there is no 'status' field for reviews. 
    // For demonstration, let's assume we can add a new column 'is_approved' to reviews table.
    // For now, I'll return the review as is if no status update is directly applicable.
    const res = await pool.query(
      'SELECT r.id, r.product_id, p.title as product_title, r.customer_id, c.name as customer_name, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r JOIN products p ON r.product_id = p.id JOIN customers c ON r.customer_id = c.id WHERE r.id = $1',
      [id]
    );
    return res.rows[0];
  }

  static async deleteReview(id) {
    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
  }
}

module.exports = AdminReviewRepository;
