const PublicBannerService = require('../services/publicBannerService');

class PublicBannerController {
  static async getBanner(req, res, next) {
    try {
      const banner = await PublicBannerService.getActiveBanner();
      res.status(200).json(banner);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicBannerController;
