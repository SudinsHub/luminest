const AdminCategoryService = require('../services/adminCategoryService');

class AdminCategoryController {
  static async createCategory(req, res, next) {
    try {
      const category = await AdminCategoryService.createCategory(req.body);
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await AdminCategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await AdminCategoryService.getCategoryById(id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const updatedCategory = await AdminCategoryService.updateCategory(id, req.body);
      res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await AdminCategoryService.deleteCategory(id);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminCategoryController;
