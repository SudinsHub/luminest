const AdminCarouselService = require('../services/adminCarouselService');
const path = require('path');
const fs = require('fs');

class AdminCarouselController {
  static async createCarousel(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const imageUrl = `/uploads/carousel/${req.files[0].filename}`;
      const image = await AdminCarouselService.createCarouselImage({ ...req.body, imageUrl });
      res.status(201).json({ message: 'Carousel image created successfully', image });
    } catch (error) {
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const filePath = path.join(__dirname, `../uploads/carousel/${file.filename}`);
          fs.unlink(filePath, err => {
            if (err) console.error('Failed to delete file after error:', err.message);
          });
        }
      }
      next(error);
    }
  }

  static async getCarouselImages(req, res, next) {
    try {
      const images = await AdminCarouselService.getAllCarouselImages();
      res.status(200).json(images);
    } catch (error) {
      next(error);
    }
  }

  static async updateCarousel(req, res, next) {
    try {
      const { id } = req.params;
      const updatedImage = await AdminCarouselService.updateCarouselImage(id, req.body);
      res.status(200).json({ message: 'Carousel image updated successfully', image: updatedImage });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCarousel(req, res, next) {
    try {
      const { id } = req.params;
      await AdminCarouselService.deleteCarouselImage(id);
      res.status(200).json({ message: 'Carousel image deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async reorderCarousel(req, res, next) {
    try {
      const { updates } = req.body;
      await AdminCarouselService.reorderCarouselImages(updates);
      res.status(200).json({ message: 'Carousel order updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminCarouselController;
