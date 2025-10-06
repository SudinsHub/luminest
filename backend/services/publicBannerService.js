const BannerRepository = require('../repositories/bannerRepository');

class PublicBannerService {
  static async getActiveBanner() {
    return BannerRepository.getActiveBanner();
  }
}

module.exports = PublicBannerService;
