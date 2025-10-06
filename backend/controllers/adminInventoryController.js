const AdminInventoryService = require('../services/adminInventoryService');

class AdminInventoryController {
  static async getInventory(req, res, next) {
    try {
      const inventory = await AdminInventoryService.getInventory();
      res.status(200).json(inventory);
    } catch (error) {
      next(error);
    }
  }

  static async updateInventory(req, res, next) {
    try {
      const { productId } = req.params;
      const { stock_quantity } = req.body;
      const updatedProduct = await AdminInventoryService.updateStock(productId, stock_quantity);
      res.status(200).json({ message: 'Inventory updated successfully', product: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  static async getLowStock(req, res, next) {
    try {
      const lowStockProducts = await AdminInventoryService.getLowStock();
      res.status(200).json(lowStockProducts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminInventoryController;
