const CouponService = require('../services/couponService');

class CouponController {
  static async validateCoupon(req, res, next) {
    try {
      const { code } = req.body;
      const coupon = await CouponService.validateCoupon(code);
      res.status(200).json({ message: 'Coupon validated successfully', coupon });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CouponController;
