const AdminProductRepository = require('../repositories/adminProductRepository');

class AdminProductService {
  static async createProduct(productData) {
    return AdminProductRepository.createProduct(productData);
  }

  static async getAllProducts() {
    return AdminProductRepository.getAllProducts();
  }

  static async getProductById(id) {
    const product = await AdminProductRepository.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async updateProduct(id, productData) {
    const updatedProduct = await AdminProductRepository.updateProduct(id, productData);
    if (!updatedProduct) {
      throw new Error('Product not found or update failed');
    }
    return updatedProduct;
  }

  static async deleteProduct(id) {
    await AdminProductRepository.deleteProduct(id);
  }

  static async addProductImage(productId, imageUrl) {
    const product = await AdminProductRepository.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return AdminProductRepository.addProductImage(productId, imageUrl);
  }

  static async deleteProductImage(productId, imageUrl) {
    const product = await AdminProductRepository.getProductImageById(productId, imageUrl);
    if (!product) {
      throw new Error('Product or image not found');
    }
    return AdminProductRepository.deleteProductImage(productId, imageUrl);
  }
}

module.exports = AdminProductService;
