const AdminInventoryRepository = require('../repositories/adminInventoryRepository');
const ProductRepository = require('../repositories/productRepository');

class AdminInventoryService {
  static async getInventory() {
    return AdminInventoryRepository.getAllInventory();
  }

  static async updateStock(productId, stockQuantity) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    const updatedProduct = await AdminInventoryRepository.updateProductStock(productId, stockQuantity);
    if (!updatedProduct) {
      throw new Error('Failed to update stock');
    }
    return updatedProduct;
  }

  static async getLowStock() {
    return AdminInventoryRepository.getLowStockProducts();
  }
}

module.exports = AdminInventoryService;
