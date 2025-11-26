const AdminProductTagRepository = require('../repositories/adminProductTagRepository');
const ProductRepository = require('../repositories/productRepository');

class AdminProductTagService {
  static async getProductTags(productId) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return AdminProductTagRepository.getProductTags(productId);
  }

  static async addTag(productId, tagName) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return AdminProductTagRepository.addProductTag(productId, tagName);
  }

  static async deleteProductTag(productId, tagId) {
    const tag = await AdminProductTagRepository.getTagById(tagId);
    if (!tag || tag.product_id !== productId) {
      throw new Error('Tag not found for this product');
    }
    await AdminProductTagRepository.deleteProductTag(tagId);
  }

  static async createTag(tagName) {
    return AdminProductTagRepository.addTag(tagName);
  }

  static async getTags() {
    return AdminProductTagRepository.getTags();
  }

  static async deleteTag(tagName) {
    await AdminProductTagRepository.deleteTag(tagName);
  }

  static async editTag(oldTagName, newTagName) {
    await AdminProductTagRepository.editTag(oldTagName, newTagName);
  }
}

module.exports = AdminProductTagService;
