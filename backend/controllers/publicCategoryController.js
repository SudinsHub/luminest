const PublicCategoryService = require('../services/publicCategoryService');

class PublicCategoryController {
  static async getCategories(req, res, next) {
    try {
      const categories = await PublicCategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await PublicCategoryService.getCategoryDetails(id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicCategoryController;
