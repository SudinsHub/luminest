const express = require('express');
const CustomerProfileController = require('../controllers/customerProfileController');
const CartController = require('../controllers/cartController');
const OrderController = require('../controllers/orderController');
const ReviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Profile Management
router.get('/profile', authenticateToken, authorizeRoles(['customer']), CustomerProfileController.getProfile);
router.put('/profile', authenticateToken, authorizeRoles(['customer']), CustomerProfileController.updateProfile);
router.delete('/account', authenticateToken, authorizeRoles(['customer']), CustomerProfileController.deleteAccount);

// Cart Management
router.get('/cart', authenticateToken, authorizeRoles(['customer']), CartController.getCart);
router.post('/cart/add', authenticateToken, authorizeRoles(['customer']), CartController.addItem);
router.put('/cart/update/:itemId', authenticateToken, authorizeRoles(['customer']), CartController.updateItem);
router.delete('/cart/remove/:itemId', authenticateToken, authorizeRoles(['customer']), CartController.removeItem);
router.delete('/cart/clear', authenticateToken, authorizeRoles(['customer']), CartController.clearCart);

// Order Management
router.get('/orders', authenticateToken, authorizeRoles(['customer']), OrderController.getOrders);
router.get('/orders/:orderId', authenticateToken, authorizeRoles(['customer']), OrderController.getOrderById);
router.post('/orders/create', authenticateToken, authorizeRoles(['customer']), OrderController.createOrder);

// Review Management
router.get('/reviews', authenticateToken, authorizeRoles(['customer']), ReviewController.getCustomerReviews);
router.post('/reviews/create', authenticateToken, authorizeRoles(['customer']), ReviewController.createReview);
router.put('/reviews/:reviewId', authenticateToken, authorizeRoles(['customer']), ReviewController.updateReview);
router.delete('/reviews/:reviewId', authenticateToken, authorizeRoles(['customer']), ReviewController.deleteReview);

module.exports = router;
