const multer = require('multer');
const path = require('path');

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const carouselStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/carousel/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadProductImages = multer({ storage: productStorage });
const uploadCarouselImages = multer({ storage: carouselStorage });
const uploadCategoryImages = multer({ storage: categoryStorage });

module.exports = {
  uploadProductImages,
  uploadCarouselImages,
  uploadCategoryImages,
};
