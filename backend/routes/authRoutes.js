const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Customer Authentication
router.post('/customer/register', AuthController.registerCustomer);
router.post('/customer/login', AuthController.loginCustomer);
router.post('/customer/google', AuthController.googleAuthCustomer);
router.post('/customer/refresh-token', AuthController.refreshCustomerToken);
router.post('/customer/logout', AuthController.logoutCustomer);

// Admin Authentication
router.post('/admin/register', AuthController.registerAdmin);
router.post('/admin/login', AuthController.loginAdmin);
router.post('/admin/refresh-token', AuthController.refreshAdminToken);
router.post('/admin/logout', AuthController.logoutAdmin);

module.exports = router; 