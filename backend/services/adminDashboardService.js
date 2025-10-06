const DashboardRepository = require('../repositories/dashboardRepository');
const AnalyticsRepository = require('../repositories/analyticsRepository');

class AdminDashboardService {
  static async getDashboardStats() {
    const totalSales = await DashboardRepository.getTotalSales();
    const totalOrders = await DashboardRepository.getTotalOrders();
    const totalCustomers = await DashboardRepository.getTotalCustomers();
    const productsOutOfStock = await DashboardRepository.getProductsOutOfStock();
    const recentOrders = await DashboardRepository.getRecentOrders();
    return { totalSales, totalOrders, totalCustomers, productsOutOfStock, recentOrders };
  }

  static async getSalesAnalytics() {
    return AnalyticsRepository.getSalesByMonth();
  }

  static async getOrderAnalytics() {
    const ordersByStatus = await AnalyticsRepository.getOrdersByStatus();
    const topSellingProducts = await AnalyticsRepository.getTopSellingProducts();
    return { ordersByStatus, topSellingProducts };
  }
}

module.exports = AdminDashboardService;
