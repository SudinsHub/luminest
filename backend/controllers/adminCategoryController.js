const AdminCategoryService = require('../services/adminCategoryService');
const path = require('path');
const fs = require('fs');
class AdminCategoryController {
  static async createCategory(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const imageUrl = `/uploads/categories/${req.files.images[0].filename}`;
      const category = await AdminCategoryService.createCategory({ ...req.body, imageUrl});
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      if (req.files && req.files.images && req.files.images.length > 0) {
        for (const file of req.files.images) {
          const filePath = path.join(__dirname, `../uploads/carousel/${file.filename}`);
          fs.unlink(filePath, err => {
            if (err) console.error('Failed to delete file after error:', err.message);
          });
        }
      }
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
