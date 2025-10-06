const pool = require('../config/db');

class ReviewRepository {
  static async createReview({ productId, customerId, rating, comment }) {
    const res = await pool.query(
      'INSERT INTO reviews (product_id, customer_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, customerId, rating, comment]
    );
    return res.rows[0];
  }

  static async getReviewById(reviewId, customerId) {
    const res = await pool.query(
      'SELECT * FROM reviews WHERE id = $1 AND customer_id = $2',
      [reviewId, customerId]
    );
    return res.rows[0];
  }

  static async getReviewsByCustomerId(customerId) {
    const res = await pool.query(
      'SELECT r.id, r.product_id, p.title as product_title, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r JOIN products p ON r.product_id = p.id WHERE r.customer_id = $1 ORDER BY r.created_at DESC',
      [customerId]
    );
    return res.rows;
  }

  static async updateReview(reviewId, customerId, { rating, comment }) {
    const res = await pool.query(
      'UPDATE reviews SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND customer_id = $4 RETURNING *',
      [rating, comment, reviewId, customerId]
    );
    return res.rows[0];
  }

  static async deleteReview(reviewId, customerId) {
    await pool.query('DELETE FROM reviews WHERE id = $1 AND customer_id = $2', [reviewId, customerId]);
  }

  static async getProductReviews(productId) {
    const res = await pool.query(
      'SELECT r.id, r.rating, r.comment, r.created_at, c.name as customer_name FROM reviews r JOIN customers c ON r.customer_id = c.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
      [productId]
    );
    return res.rows;
  }

  static async updateProductRating(productId) {
    const res = await pool.query(
      'UPDATE products SET average_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1), total_reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = $1), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING average_rating, total_reviews',
      [productId]
    );
    return res.rows[0];
  }
}

module.exports = ReviewRepository;
