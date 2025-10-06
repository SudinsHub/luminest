const AdminCarouselRepository = require('../repositories/adminCarouselRepository');

class AdminCarouselService {
  static async createCarouselImage(imageData) {
    return AdminCarouselRepository.createCarouselImage(imageData);
  }

  static async getAllCarouselImages() {
    return AdminCarouselRepository.getAllCarouselImages();
  }

  static async getCarouselImageById(id) {
    const image = await AdminCarouselRepository.getCarouselImageById(id);
    if (!image) {
      throw new Error('Carousel image not found');
    }
    return image;
  }

  static async updateCarouselImage(id, imageData) {
    const updatedImage = await AdminCarouselRepository.updateCarouselImage(id, imageData);
    if (!updatedImage) {
      throw new Error('Carousel image not found or update failed');
    }
    return updatedImage;
  }

  static async deleteCarouselImage(id) {
    await AdminCarouselRepository.deleteCarouselImage(id);
  }

  static async reorderCarouselImages(updates) {
    return AdminCarouselRepository.updateCarouselOrder(updates);
  }
}

module.exports = AdminCarouselService;
