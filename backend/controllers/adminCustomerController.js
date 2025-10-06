const AdminCustomerService = require('../services/adminCustomerService');

class AdminCustomerController {
  static async getCustomers(req, res, next) {
    try {
      const customers = await AdminCustomerService.getAllCustomers();
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await AdminCustomerService.getCustomerById(id);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomerStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      // Placeholder as schema does not have a status field for customers
      const updatedCustomer = await AdminCustomerService.updateCustomerStatus(id, status);
      res.status(200).json({ message: 'Customer status update (placeholder) successful', customer: updatedCustomer });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminCustomerController;
