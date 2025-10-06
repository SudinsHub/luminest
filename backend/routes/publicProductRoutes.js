const express = require('express');
const PublicProductController = require('../controllers/publicProductController');

const router = express.Router();

// Get all products with filters
router.get('/', PublicProductController.getProducts);
// Get single product
router.get('/:id', PublicProductController.getProductById);
// Get featured products by tag
router.get('/tag/:tag', PublicProductController.getFeaturedProducts);
// Get products by category
router.get('/by-category/:categoryId', PublicProductController.getProductsByCategory);
// Get product reviews (publicly accessible)
router.get('/:productId/reviews', PublicProductController.getProductReviews);

module.exports = router;
