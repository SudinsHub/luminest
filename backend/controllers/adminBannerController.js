const AdminBannerService = require('../services/adminBannerService');

class AdminBannerController {
  static async getBanner(req, res, next) {
    try {
      const banner = await AdminBannerService.getBanner();
      res.status(200).json(banner);
    } catch (error) {
      next(error);
    }
  }

  static async updateBanner(req, res, next) {
    try {
      const { message, is_active } = req.body;
      const updatedBanner = await AdminBannerService.updateBanner({ message, isActive: is_active });
      res.status(200).json({ message: 'Banner updated successfully', banner: updatedBanner });
    } catch (error) {
      next(error);
    }
  }

  static async toggleBanner(req, res, next) {
    try {
      const { is_active } = req.body;
      const toggledBanner = await AdminBannerService.toggleBanner(is_active);
      res.status(200).json({ message: 'Banner status updated successfully', banner: toggledBanner });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminBannerController;
