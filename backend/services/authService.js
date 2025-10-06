const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepository = require('../repositories/authRepository');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
};

class AuthService {
  static async registerCustomer({ name, address, contact_no, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await AuthRepository.registerCustomer({ name, address, contact_no, email, password: hashedPassword });
    const { accessToken, refreshToken } = generateTokens({ id: customer.id, role: 'customer' });
    return { customer, accessToken, refreshToken };
  }

  static async loginCustomer({ email, password }) {
    const customer = await AuthRepository.findCustomerByEmail(email);
    if (!customer) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    const { accessToken, refreshToken } = generateTokens({ id: customer.id, role: 'customer' });
    return { customer, accessToken, refreshToken };
  }

  static async googleAuthCustomer(profile) {
    let customer = await AuthRepository.findCustomerByGoogleId(profile.id);
    if (!customer) {
      customer = await AuthRepository.registerCustomer({
        name: profile.displayName,
        email: profile.emails[0].value,
        google_id: profile.id,
        password: null, // Google authenticated users don't have a password
      });
    }
    const { accessToken, refreshToken } = generateTokens({ id: customer.id, role: 'customer' });
    return { customer, accessToken, refreshToken };
  }

  static async refreshCustomerToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const customer = await AuthRepository.findCustomerById(decoded.id);
      if (!customer) {
        throw new Error('Invalid token');
      }
      const { accessToken, refreshToken } = generateTokens({ id: customer.id, role: 'customer' });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async registerAdmin({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await AuthRepository.registerAdmin({ name, email, password: hashedPassword });
    const { accessToken, refreshToken } = generateTokens({ id: admin.id, role: 'admin' });
    return { admin, accessToken, refreshToken };
  }

  static async loginAdmin({ email, password }) {
    const admin = await AuthRepository.findAdminByEmail(email);
    if (!admin) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    const { accessToken, refreshToken } = generateTokens({ id: admin.id, role: 'admin' });
    return { admin, accessToken, refreshToken };
  }

  static async refreshAdminToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const admin = await AuthRepository.findAdminById(decoded.id);
      if (!admin) {
        throw new Error('Invalid token');
      }
      const { accessToken, refreshToken } = generateTokens({ id: admin.id, role: 'admin' });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = AuthService;
