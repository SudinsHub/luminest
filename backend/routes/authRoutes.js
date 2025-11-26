const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer Authentication
router.post('/customer/register', AuthController.registerCustomer); 
router.post('/customer/login', AuthController.loginCustomer);
router.post('/customer/google', AuthController.googleAuthCustomer);
router.post('/customer/refresh-token', AuthController.refreshCustomerToken);
router.post('/customer/logout', AuthController.logoutCustomer);
router.get('/customer/profile', authenticateToken, authorizeRoles(['customer']), AuthController.getCustomer);

// Admin Authentication
router.post('/admin/register', AuthController.registerAdmin);
router.post('/admin/login', AuthController.loginAdmin);
router.post('/admin/refresh-token', AuthController.refreshAdminToken);
router.post('/admin/logout', AuthController.logoutAdmin);
router.get('/admin/profile', authenticateToken, authorizeRoles(['admin']), AuthController.getAdmin);

module.exports = router; 