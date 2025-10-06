const AdminBannerRepository = require('../repositories/adminBannerRepository');

class AdminBannerService {
  static async getBanner() {
    return AdminBannerRepository.getBanner();
  }

  static async updateBanner(bannerData) {
    let banner = await AdminBannerRepository.getBanner();
    if (banner) {
      const updatedBanner = await AdminBannerRepository.updateBanner(banner.id, bannerData);
      return updatedBanner;
    } else {
      const newBanner = await AdminBannerRepository.createBanner(bannerData);
      return newBanner;
    }
  }

  static async toggleBanner(isActive) {
    let banner = await AdminBannerRepository.getBanner();
    if (!banner) {
      throw new Error('Banner not found');
    }
    const toggledBanner = await AdminBannerRepository.toggleBanner(banner.id, isActive);
    return toggledBanner;
  }
}

module.exports = AdminBannerService;
