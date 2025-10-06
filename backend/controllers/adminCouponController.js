const AdminCouponService = require('../services/adminCouponService');

class AdminCouponController {
  static async createCoupon(req, res, next) {
    try {
      const coupon = await AdminCouponService.createCoupon(req.body);
      res.status(201).json({ message: 'Coupon created successfully', coupon });
    } catch (error) {
      next(error);
    }
  }

  static async getCoupons(req, res, next) {
    try {
      const coupons = await AdminCouponService.getAllCoupons();
      res.status(200).json(coupons);
    } catch (error) {
      next(error);
    }
  }

  static async getCouponById(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = await AdminCouponService.getCouponById(id);
      res.status(200).json(coupon);
    } catch (error) {
      next(error);
    }
  }

  static async updateCoupon(req, res, next) {
    try {
      const { id } = req.params;
      const updatedCoupon = await AdminCouponService.updateCoupon(id, req.body);
      res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCoupon(req, res, next) {
    try {
      const { id } = req.params;
      await AdminCouponService.deleteCoupon(id);
      res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getCouponUsageStats(req, res, next) {
    try {
      const { id } = req.params;
      const stats = await AdminCouponService.getCouponUsageStats(id);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminCouponController;
