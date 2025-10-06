const express = require('express');
const AdminDashboardController = require('../controllers/adminDashboardController');
const AdminProductController = require('../controllers/adminProductController');
const AdminCategoryController = require('../controllers/adminCategoryController');
const AdminProductTagController = require('../controllers/adminProductTagController');
const AdminOrderController = require('../controllers/adminOrderController');
const AdminInventoryController = require('../controllers/adminInventoryController');
const AdminCouponController = require('../controllers/adminCouponController');
const AdminCarouselController = require('../controllers/adminCarouselController');
const AdminBannerController = require('../controllers/adminBannerController');
const AdminCustomerController = require('../controllers/adminCustomerController');
const AdminReviewController = require('../controllers/adminReviewController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {uploadProductImages, uploadCarouselImages} = require('../middleware/uploadMiddleware');

const router = express.Router();

// Dashboard & Analytics
router.get('/dashboard/stats', authenticateToken, authorizeRoles(['admin']), AdminDashboardController.getDashboardStats);
router.get('/sales/analytics', authenticateToken, authorizeRoles(['admin']), AdminDashboardController.getSalesAnalytics);
router.get('/orders/analytics', authenticateToken, authorizeRoles(['admin']), AdminDashboardController.getOrderAnalytics);

// Product Management
router.get('/products', authenticateToken, authorizeRoles(['admin']), AdminProductController.getProducts);
router.get('/products/:id', authenticateToken, authorizeRoles(['admin']), AdminProductController.getProductById);
router.post('/products/create', authenticateToken, authorizeRoles(['admin']), AdminProductController.createProduct);
router.put('/products/:id', authenticateToken, authorizeRoles(['admin']), AdminProductController.updateProduct);
router.delete('/products/:id', authenticateToken, authorizeRoles(['admin']), AdminProductController.deleteProduct);
router.post('/products/:id/images/upload', authenticateToken, authorizeRoles(['admin']), uploadProductImages.single('image'), AdminProductController.uploadProductImage);
router.delete('/products/:id/images/:imageId', authenticateToken, authorizeRoles(['admin']), AdminProductController.deleteProductImage);

// Category Management
router.get('/categories', authenticateToken, authorizeRoles(['admin']), AdminCategoryController.getCategories);
router.get('/categories/:id', authenticateToken, authorizeRoles(['admin']), AdminCategoryController.getCategoryById);
router.post('/categories/create', authenticateToken, authorizeRoles(['admin']), AdminCategoryController.createCategory);
router.put('/categories/:id', authenticateToken, authorizeRoles(['admin']), AdminCategoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, authorizeRoles(['admin']), AdminCategoryController.deleteCategory);

// Product Tags Management
router.get('/products/:productId/tags', authenticateToken, authorizeRoles(['admin']), AdminProductTagController.getProductTags);
router.post('/products/:productId/tags', authenticateToken, authorizeRoles(['admin']), AdminProductTagController.addProductTag);
router.delete('/products/:productId/tags/:tagId', authenticateToken, authorizeRoles(['admin']), AdminProductTagController.deleteProductTag);

// Order Management
router.get('/orders', authenticateToken, authorizeRoles(['admin']), AdminOrderController.getOrders);
router.get('/orders/:id', authenticateToken, authorizeRoles(['admin']), AdminOrderController.getOrderById);
router.put('/orders/:id/status', authenticateToken, authorizeRoles(['admin']), AdminOrderController.updateOrderStatus);
router.post('/orders/:id/generate-bill-pdf', authenticateToken, authorizeRoles(['admin']), AdminOrderController.generateBillPdf);
router.post('/orders/:id/generate-shipping-label', authenticateToken, authorizeRoles(['admin']), AdminOrderController.generateShippingLabel);

// Inventory Management
router.get('/inventory', authenticateToken, authorizeRoles(['admin']), AdminInventoryController.getInventory);
router.put('/inventory/:productId', authenticateToken, authorizeRoles(['admin']), AdminInventoryController.updateInventory);
router.get('/inventory/low-stock', authenticateToken, authorizeRoles(['admin']), AdminInventoryController.getLowStock);

// Coupon Management
router.get('/coupons', authenticateToken, authorizeRoles(['admin']), AdminCouponController.getCoupons);
router.get('/coupons/:id', authenticateToken, authorizeRoles(['admin']), AdminCouponController.getCouponById);
router.post('/coupons/create', authenticateToken, authorizeRoles(['admin']), AdminCouponController.createCoupon);
router.put('/coupons/:id', authenticateToken, authorizeRoles(['admin']), AdminCouponController.updateCoupon);
router.delete('/coupons/:id', authenticateToken, authorizeRoles(['admin']), AdminCouponController.deleteCoupon);
router.get('/coupons/:id/usage-stats', authenticateToken, authorizeRoles(['admin']), AdminCouponController.getCouponUsageStats);

// Carousel Management
router.get('/carousel', authenticateToken, authorizeRoles(['admin']), AdminCarouselController.getCarouselImages);
router.post('/carousel/create', authenticateToken, authorizeRoles(['admin']), uploadCarouselImages.array('images'), AdminCarouselController.createCarousel);
router.put('/carousel/:id', authenticateToken, authorizeRoles(['admin']), AdminCarouselController.updateCarousel);
router.delete('/carousel/:id', authenticateToken, authorizeRoles(['admin']), AdminCarouselController.deleteCarousel);
router.put('/carousel/reorder', authenticateToken, authorizeRoles(['admin']), AdminCarouselController.reorderCarousel);

// Banner Management
router.get('/banner', authenticateToken, authorizeRoles(['admin']), AdminBannerController.getBanner);
router.put('/banner', authenticateToken, authorizeRoles(['admin']), AdminBannerController.updateBanner);
router.post('/banner/toggle', authenticateToken, authorizeRoles(['admin']), AdminBannerController.toggleBanner);

// Customer Management
router.get('/customers', authenticateToken, authorizeRoles(['admin']), AdminCustomerController.getCustomers);
router.get('/customers/:id', authenticateToken, authorizeRoles(['admin']), AdminCustomerController.getCustomerById);
router.put('/customers/:id/status', authenticateToken, authorizeRoles(['admin']), AdminCustomerController.updateCustomerStatus);

// Review Management
router.get('/reviews', authenticateToken, authorizeRoles(['admin']), AdminReviewController.getReviews);
router.put('/reviews/:id/status', authenticateToken, authorizeRoles(['admin']), AdminReviewController.updateReviewStatus);
router.delete('/reviews/:id', authenticateToken, authorizeRoles(['admin']), AdminReviewController.deleteReview);

module.exports = router;
