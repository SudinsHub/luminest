const express = require('express');
const PublicBannerController = require('../controllers/publicBannerController');

const router = express.Router();

// Get active banner
router.get('/', PublicBannerController.getBanner);

module.exports = router;
