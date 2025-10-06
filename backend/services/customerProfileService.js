const CustomerProfileRepository = require('../repositories/customerProfileRepository');

class CustomerProfileService {
  static async getProfile(customerId) {
    const profile = await CustomerProfileRepository.getCustomerProfile(customerId);
    if (!profile) {
      throw new Error('Customer profile not found');
    }
    return profile;
  }

  static async updateProfile(customerId, profileData) {
    const updatedProfile = await CustomerProfileRepository.updateCustomerProfile(customerId, profileData);
    if (!updatedProfile) {
      throw new Error('Customer profile not found or update failed');
    }
    return updatedProfile;
  }

  static async deleteAccount(customerId) {
    await CustomerProfileRepository.deleteCustomerAccount(customerId);
    return { message: 'Customer account deleted successfully' };
  }
}

module.exports = CustomerProfileService;
