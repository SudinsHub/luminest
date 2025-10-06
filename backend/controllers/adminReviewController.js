const AdminReviewService = require('../services/adminReviewService');

class AdminReviewController {
  static async getReviews(req, res, next) {
    try {
      const reviews = await AdminReviewService.getAllReviews();
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  }

  static async updateReviewStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedReview = await AdminReviewService.updateReviewStatus(id, status);
      res.status(200).json({ message: 'Review status updated (placeholder) successfully', review: updatedReview });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req, res, next) {
    try {
      const { id } = req.params;
      await AdminReviewService.deleteReview(id);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminReviewController;
