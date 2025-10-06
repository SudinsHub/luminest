const express = require('express');
const UploadController = require('../controllers/uploadController');
const { uploadProductImages, uploadCarouselImages, uploadCategoryImages } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/product-images', uploadProductImages.single('image'), UploadController.uploadProductImages);
router.post('/carousel-images', uploadCarouselImages.single('image'), UploadController.uploadCarouselImages);
router.post('/category-images', uploadCategoryImages.single('image'), UploadController.uploadCategoryImages);

module.exports = router;
