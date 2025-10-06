const CarouselRepository = require('../repositories/carouselRepository');

class PublicCarouselService {
  static async getActiveImages() {
    return CarouselRepository.getActiveCarouselImages();
  }
}

module.exports = PublicCarouselService;
