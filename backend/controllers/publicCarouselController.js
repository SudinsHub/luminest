const PublicCarouselService = require('../services/publicCarouselService');

class PublicCarouselController {
  static async getCarouselImages(req, res, next) {
    try {
      const images = await PublicCarouselService.getActiveImages();
      res.status(200).json(images);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicCarouselController;
