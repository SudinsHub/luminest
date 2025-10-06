const AdminReviewRepository = require('../repositories/adminReviewRepository');
const ReviewRepository = require('../repositories/reviewRepository');

class AdminReviewService {
  static async getAllReviews() {
    return AdminReviewRepository.getAllReviews();
  }

  static async updateReviewStatus(id, status) {
    const review = await AdminReviewRepository.getReviewById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    // Placeholder as schema does not have a status field for reviews.
    const updatedReview = await AdminReviewRepository.updateReviewStatus(id, status);
    return updatedReview;
  }

  static async deleteReview(id) {
    const review = await AdminReviewRepository.getReviewById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    await AdminReviewRepository.deleteReview(id);
    await ReviewRepository.updateProductRating(review.product_id); // Recalculate product rating
  }
}

module.exports = AdminReviewService;
