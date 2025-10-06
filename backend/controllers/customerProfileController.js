const CustomerProfileService = require('../services/customerProfileService');

class CustomerProfileController {
  static async getProfile(req, res, next) {
    try {
      const customerId = req.user.id;
      const profile = await CustomerProfileService.getProfile(customerId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const customerId = req.user.id;
      const { name, address, contact_no, email } = req.body;
      const updatedProfile = await CustomerProfileService.updateProfile(customerId, { name, address, contact_no, email });
      res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req, res, next) {
    try {
      const customerId = req.user.id;
      const result = await CustomerProfileService.deleteAccount(customerId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerProfileController;
