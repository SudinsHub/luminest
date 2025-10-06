const AdminCouponRepository = require('../repositories/adminCouponRepository');

class AdminCouponService {
  static async createCoupon(couponData) {
    return AdminCouponRepository.createCoupon(couponData);
  }

  static async getAllCoupons() {
    return AdminCouponRepository.getAllCoupons();
  }

  static async getCouponById(id) {
    const coupon = await AdminCouponRepository.getCouponById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    return coupon;
  }

  static async updateCoupon(id, couponData) {
    const updatedCoupon = await AdminCouponRepository.updateCoupon(id, couponData);
    if (!updatedCoupon) {
      throw new Error('Coupon not found or update failed');
    }
    return updatedCoupon;
  }

  static async deleteCoupon(id) {
    await AdminCouponRepository.deleteCoupon(id);
  }

  static async getCouponUsageStats(id) {
    const stats = await AdminCouponRepository.getCouponUsageStats(id);
    if (!stats) {
      throw new Error('Coupon not found');
    }
    return stats;
  }
}

module.exports = AdminCouponService;
