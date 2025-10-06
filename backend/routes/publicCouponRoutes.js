const express = require('express');
const CouponController = require('../controllers/couponController');

const router = express.Router();

// Validate coupon code
router.post('/validate', CouponController.validateCoupon);

module.exports = router;
