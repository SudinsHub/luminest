const AdminProductTagRepository = require('../repositories/adminProductTagRepository');
const ProductRepository = require('../repositories/productRepository');

class AdminProductTagService {
  static async getTags(productId) {
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

  static async deleteTag(productId, tagId) {
    const tag = await AdminProductTagRepository.getTagById(tagId);
    if (!tag || tag.product_id !== productId) {
      throw new Error('Tag not found for this product');
    }
    await AdminProductTagRepository.deleteProductTag(tagId);
  }
}

module.exports = AdminProductTagService;
