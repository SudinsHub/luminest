const ReviewRepository = require('../repositories/reviewRepository');
const ProductRepository = require('../repositories/productRepository');

class ReviewService {
  static async createReview(customerId, { productId, rating, comment }) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    const review = await ReviewRepository.createReview({ productId, customerId, rating, comment });
    await ReviewRepository.updateProductRating(productId);
    return review;
  }

  static async getCustomerReviews(customerId) {
    return ReviewRepository.getReviewsByCustomerId(customerId);
  }

  static async updateReview(reviewId, customerId, { rating, comment }) {
    const existingReview = await ReviewRepository.getReviewById(reviewId, customerId);
    if (!existingReview) {
      throw new Error('Review not found or you do not have permission to update it');
    }
    const updatedReview = await ReviewRepository.updateReview(reviewId, customerId, { rating, comment });
    await ReviewRepository.updateProductRating(updatedReview.product_id);
    return updatedReview;
  }

  static async deleteReview(reviewId, customerId) {
    const existingReview = await ReviewRepository.getReviewById(reviewId, customerId);
    if (!existingReview) {
      throw new Error('Review not found or you do not have permission to delete it');
    }
    await ReviewRepository.deleteReview(reviewId, customerId);
    await ReviewRepository.updateProductRating(existingReview.product_id);
  }
}

module.exports = ReviewService;
