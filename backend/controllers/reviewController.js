const ReviewService = require('../services/reviewService');

class ReviewController {
  static async createReview(req, res, next) {
    try {
      const customerId = req.user.id;
      const { productId, rating, comment } = req.body;
      const review = await ReviewService.createReview(customerId, { productId, rating, comment });
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerReviews(req, res, next) {
    try {
      const customerId = req.user.id;
      const reviews = await ReviewService.getCustomerReviews(customerId);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req, res, next) {
    try {
      const customerId = req.user.id;
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const updatedReview = await ReviewService.updateReview(reviewId, customerId, { rating, comment });
      res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req, res, next) {
    try {
      const customerId = req.user.id;
      const { reviewId } = req.params;
      await ReviewService.deleteReview(reviewId, customerId);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController;
