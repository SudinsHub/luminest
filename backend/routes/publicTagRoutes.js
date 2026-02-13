const express = require('express');
const AdminProductTagController = require('../controllers/adminProductTagController');

const router = express.Router();
router.get('/', AdminProductTagController.getTags);
module.exports = router;
