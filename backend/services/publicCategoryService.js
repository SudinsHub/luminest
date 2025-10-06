const CategoryRepository = require('../repositories/categoryRepository');

class PublicCategoryService {
  static async getAllCategories() {
    return CategoryRepository.getAllCategories();
  }

  static async getCategoryDetails(id) {
    const category = await CategoryRepository.getCategoryById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}

module.exports = PublicCategoryService;
