const AdminProductService = require('../services/adminProductService');

class AdminProductController {
  static async createProduct(req, res, next) {
    try {
      const product = await AdminProductService.createProduct(req.body);
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req, res, next) {
    try {
      const products = await AdminProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await AdminProductService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await AdminProductService.updateProduct(id, req.body);
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await AdminProductService.deleteProduct(id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async uploadProductImage(req, res, next) {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      const images = await AdminProductService.addProductImage(id, imageUrl);
      res.status(200).json({ message: 'Image uploaded successfully', images });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductImage(req, res, next) {
    try {
      const { id, imageId } = req.params; // imageId here refers to the image URL for simplicity
      await AdminProductService.deleteProductImage(id, `/uploads/${imageId}`);
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminProductController;
