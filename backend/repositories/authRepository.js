const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

class AuthRepository {
  static async registerCustomer({ name, address, contact_no, email, password }) {
    return Customer.create({ name, address, contact_no, email, password });
  }

  static async findCustomerByEmail(email) {
    return Customer.findByEmail(email);
  }

  static async findCustomerById(id) {
    return Customer.findById(id);
  }

  static async findCustomerByGoogleId(google_id) {
    return Customer.findByGoogleId(google_id);
  }

  static async registerAdmin({ name, email, password }) {
    return Admin.create({ name, email, password });
  }

  static async findAdminByEmail(email) {
    return Admin.findByEmail(email);
  }

  static async findAdminById(id) {
    return Admin.findById(id);
  }
}

module.exports = AuthRepository;
