const AdminCategoryRepository = require('../repositories/adminCategoryRepository');

class AdminCategoryService {
  static async createCategory(categoryData) {
    return AdminCategoryRepository.createCategory(categoryData);
  }

  static async getAllCategories() {
    return AdminCategoryRepository.getAllCategories();
  }

  static async getCategoryById(id) {
    const category = await AdminCategoryRepository.getCategoryById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  static async updateCategory(id, categoryData) {
    const updatedCategory = await AdminCategoryRepository.updateCategory(id, categoryData);
    if (!updatedCategory) {
      throw new Error('Category not found or update failed');
    }
    return updatedCategory;
  }

  static async deleteCategory(id) {
    await AdminCategoryRepository.deleteCategory(id);
  }
}

module.exports = AdminCategoryService;
