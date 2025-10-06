class UploadController {
  static async uploadProductImages(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const imageUrl = `/uploads/products/${req.file.filename}`;
      res.status(200).json({ message: 'Product image uploaded successfully.', imageUrl });
    } catch (error) {
      next(error);
    }
  }

  static async uploadCarouselImages(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const imageUrl = `/uploads/carousel/${req.file.filename}`;
      res.status(200).json({ message: 'Carousel image uploaded successfully.', imageUrl });
    } catch (error) {
      next(error);
    }
  }

  static async uploadCategoryImages(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const imageUrl = `/uploads/categories/${req.file.filename}`;
      res.status(200).json({ message: 'Category image uploaded successfully.', imageUrl });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UploadController;
