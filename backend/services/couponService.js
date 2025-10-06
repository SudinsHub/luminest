const CouponRepository = require('../repositories/couponRepository');

class CouponService {
  static async validateCoupon(code) {
    const coupon = await CouponRepository.findByCode(code);
    if (!coupon || !coupon.is_active || new Date() < new Date(coupon.valid_from) || (coupon.valid_until && new Date() > new Date(coupon.valid_until))) {
      throw new Error('Invalid or expired coupon');
    }
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      throw new Error('Coupon usage limit reached');
    }
    return coupon;
  }
}

module.exports = CouponService;
