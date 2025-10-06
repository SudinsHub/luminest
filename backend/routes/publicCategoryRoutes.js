const express = require('express');
const PublicCategoryController = require('../controllers/publicCategoryController');

const router = express.Router();

// Get all categories
router.get('/', PublicCategoryController.getCategories);
// Get single category
router.get('/:id', PublicCategoryController.getCategoryById);

module.exports = router;
