const PublicProductService = require('../services/publicProductService');

class PublicProductController {
  static async getProducts(req, res, next) {
    try {
      const filters = req.query;
      const products = await PublicProductService.getProducts(filters);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await PublicProductService.getProductDetails(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedProducts(req, res, next) {
    try {
      const { tag } = req.params;
      const products = await PublicProductService.getFeaturedProducts(tag);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductsByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const products = await PublicProductService.getProductsByCategory(categoryId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductsByCategoryLatestLimited(req, res, next) {
    try {
      const { categoryName } = req.params;
      const products = await PublicProductService.getProductsByCategoryLatestLimited(categoryName);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductReviews(req, res, next) {
    try {
      const { productId } = req.params;
      const reviews = await PublicProductService.getProductDetails(productId);
      res.status(200).json(reviews.reviews);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicProductController;
