const AdminProductService = require('../services/adminProductService');
const path = require('path');
const fs = require('fs');

class AdminProductController {
  static async createProduct(req, res, next) {
    try {
      if (!req.files ) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const images = [];
      req.files.images.map(file => {
        images.push(`/uploads/products/${file.filename}`);
      });
      const product = await AdminProductService.createProduct({ ...req.body, images });
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      if (req.files && req.files.images && req.files.images.length > 0) {
        for (const file of req.files.images) {
          const filePath = path.join(__dirname, `../uploads/products/${file.filename}`);
          fs.unlink(filePath, err => {
            if (err) console.error('Failed to delete file after error:', err.message);
          });
        }
      }
      next(error);
    }
  }

  static async getAllProductsWithCategory(req, res, next) {
    try {
      const products = await AdminProductService.getAllProductsWithCategory();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getAllProducts(req, res, next) {
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
      const { title, description, price, stock_quantity, categoryIds, tags, imageOrder } = req.body;
      const uploadedFiles = req.files?.newImages || [];

      // Parse categoryIds and tags if they are JSON strings
      let parsedCategoryIds = categoryIds;
      let parsedTags = tags;
      try {
        if (typeof categoryIds === 'string') {
          parsedCategoryIds = JSON.parse(categoryIds);
        }
        if (typeof tags === 'string') {
          parsedTags = JSON.parse(tags);
        }
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }

      // Parse imageOrder
      let parsedImageOrder = [];
      try {
        parsedImageOrder = JSON.parse(imageOrder);
      } catch (err) {
        console.error('Error parsing imageOrder:', err);
        return res.status(400).json({ message: 'Invalid imageOrder format' });
      }

      // Build final images array from imageOrder
      const finalImages = [];
      let newFileIndex = 0;

      for (const item of parsedImageOrder) {
        if (item.startsWith('existing:')) {
          const url = item.replace('existing:', '');
          finalImages.push(url);
        } else if (item.startsWith('new:')) {
          if (newFileIndex < uploadedFiles.length) {
            const file = uploadedFiles[newFileIndex];
            finalImages.push(`/uploads/products/${file.filename}`);
            newFileIndex++;
          }
        }
      }

      // Get the current product to find removed images
      const currentProduct = await AdminProductService.getProductById(id);
      const oldImages = currentProduct.images || [];
      const removedImages = oldImages.filter(img => !finalImages.includes(img));

      // Delete removed image files from filesystem
      for (const imageUrl of removedImages) {
        const filename = imageUrl.replace('/uploads/products/', '');
        const filePath = path.join(__dirname, `../uploads/products/${filename}`);
        fs.unlink(filePath, err => {
          if (err) console.error('Failed to delete file:', err.message);
        });
      }

      // Update product with new data
      const updatedProduct = await AdminProductService.updateProduct(id, {
        title,
        description,
        price: Number.parseFloat(price),
        stock_quantity: Number.parseInt(stock_quantity),
        images: finalImages,
        categoryIds: parsedCategoryIds,
        tags: parsedTags,
      });

      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files && req.files.newImages && req.files.newImages.length > 0) {
        for (const file of req.files.newImages) {
          const filePath = path.join(__dirname, `../uploads/products/${file.filename}`);
          fs.unlink(filePath, err => {
            if (err) console.error('Failed to delete file after error:', err.message);
          });
        }
      }
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
      const imageUrl = `/uploads/products/${req.file.filename}`;
      const images = await AdminProductService.addProductImage(id, imageUrl);
      res.status(200).json({ message: 'Image uploaded successfully', images });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductImage(req, res, next) {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'imageUrl is required' });
      }

      // Delete file from filesystem
      const filename = imageUrl.replace('/uploads/products/', '');
      const filePath = path.join(__dirname, `../uploads/products/${filename}`);

      fs.unlink(filePath, err => {
        if (err) console.error('Failed to delete file:', err.message);
      });

      // Remove image from database
      await AdminProductService.removeImageFromProduct(id, imageUrl);
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminProductController;
