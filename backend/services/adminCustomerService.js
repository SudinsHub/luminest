const AdminCustomerRepository = require('../repositories/adminCustomerRepository');

class AdminCustomerService {
  static async getAllCustomers() {
    return AdminCustomerRepository.getAllCustomers();
  }

  static async getCustomerById(id) {
    const customer = await AdminCustomerRepository.getCustomerById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  static async updateCustomerStatus(id, status) {
    // As per repository comment, no direct 'status' field in schema.
    // This service layer call is currently a passthrough or placeholder.
    const updatedCustomer = await AdminCustomerRepository.updateCustomerStatus(id, status);
    if (!updatedCustomer) {
      throw new Error('Customer not found or status update failed');
    }
    return updatedCustomer;
  }
}

module.exports = AdminCustomerService;
