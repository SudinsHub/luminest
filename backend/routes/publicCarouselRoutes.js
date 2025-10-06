const express = require('express');
const PublicCarouselController = require('../controllers/publicCarouselController');

const router = express.Router();

// Get active carousel images
router.get('/', PublicCarouselController.getCarouselImages);

module.exports = router;
