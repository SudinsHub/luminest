const AdminDashboardService = require('../services/adminDashboardService');

class AdminDashboardController {
  static async getDashboardStats(req, res, next) {
    try {
      const stats = await AdminDashboardService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getSalesAnalytics(req, res, next) {
    try {
      const salesData = await AdminDashboardService.getSalesAnalytics();
      res.status(200).json(salesData);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderAnalytics(req, res, next) {
    try {
      const orderData = await AdminDashboardService.getOrderAnalytics();
      res.status(200).json(orderData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminDashboardController;
