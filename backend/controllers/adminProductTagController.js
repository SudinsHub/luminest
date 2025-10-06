const AdminProductTagService = require('../services/adminProductTagService');

class AdminProductTagController {
  static async getProductTags(req, res, next) {
    try {
      const { productId } = req.params;
      const tags = await AdminProductTagService.getTags(productId);
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  }

  static async addProductTag(req, res, next) {
    try {
      const { productId } = req.params;
      const { tagName } = req.body;
      const tag = await AdminProductTagService.addTag(productId, tagName);
      res.status(201).json({ message: 'Tag added successfully', tag });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductTag(req, res, next) {
    try {
      const { productId, tagId } = req.params;
      await AdminProductTagService.deleteTag(productId, tagId);
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminProductTagController;
