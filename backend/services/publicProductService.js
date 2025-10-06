const PublicProductRepository = require('../repositories/publicProductRepository');
const ReviewRepository = require('../repositories/reviewRepository');

class PublicProductService {
  static async getProducts({ page = 1, limit = 10, category, min_price, max_price, rating, sort, search, tag }) {
    const products = await PublicProductRepository.getAllProducts({
      page,
      limit,
      categoryId: category,
      minPrice: min_price,
      maxPrice: max_price,
      rating,
      sort,
      search,
      tag,
    });
    return products;
  }

  static async getProductDetails(id) {
    const product = await PublicProductRepository.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    const reviews = await ReviewRepository.getProductReviews(id);
    return { ...product, reviews };
  }

  static async getFeaturedProducts(tagName) {
    return PublicProductRepository.getProductsByTag(tagName);
  }

  static async getProductsByCategory(categoryId) {
    return PublicProductRepository.getProductsByCategoryId(categoryId);
  }
}

module.exports = PublicProductService;
