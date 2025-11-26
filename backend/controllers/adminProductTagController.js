const AdminProductTagService = require('../services/adminProductTagService');

class AdminProductTagController {
  static async getProductTags(req, res, next) {
    try {
      const { productId } = req.params;
      const tags = await AdminProductTagService.getProductTags(productId);
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  }

  static async getTags(req, res, next) {
    try {
      const tags = await AdminProductTagService.getTags();
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
      await AdminProductTagService.deleteProductTag(productId, tagId);
      res.status(200).json({ message: 'Tag with this deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
  
  static async deleteTag(req, res, next) {
    try {
      const { tagName } = req.params;
      await AdminProductTagService.deleteTag(tagName);
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async createTag(req, res, next) {
    try {
      const { tagName } = req.body;
      const tag = await AdminProductTagService.createTag(tagName);
      res.status(201).json({ message: 'Tag created successfully', tag });
    } catch (error) {
      next(error);
    }
  }

  static async editTag(req, res, next) {
    try {
      const { oldTagName, newTagName } = req.body;
      const tag = await AdminProductTagService.editTag(oldTagName, newTagName);
      res.status(201).json({ message: 'Tag created successfully', tag });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminProductTagController;
