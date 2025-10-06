const AuthService = require('../services/authService');

class AuthController {
  static async registerCustomer(req, res, next) {
    try {
      const { name, address, contact_no, email, password } = req.body;
      const { customer, accessToken, refreshToken } = await AuthService.registerCustomer({ name, address, contact_no, email, password });
      res.status(201).json({ message: 'Customer registered successfully', customer, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async loginCustomer(req, res, next) {
    try {
      const { email, password } = req.body;
      const { customer, accessToken, refreshToken } = await AuthService.loginCustomer({ email, password });
      res.status(200).json({ message: 'Customer logged in successfully', customer, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async googleAuthCustomer(req, res, next) {
    try {
      const { profile } = req.body; // Assuming profile is sent from frontend after Google login
      const { customer, accessToken, refreshToken } = await AuthService.googleAuthCustomer(profile);
      res.status(200).json({ message: 'Customer logged in with Google successfully', customer, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async refreshCustomerToken(req, res, next) {
    try {
      const { refreshToken: oldRefreshToken } = req.body;
      const { accessToken, refreshToken } = await AuthService.refreshCustomerToken(oldRefreshToken);
      res.status(200).json({ message: 'Customer token refreshed successfully', accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async logoutCustomer(req, res, next) {
    try {
      // For JWT, logout is typically handled client-side by discarding tokens.
      // If server-side token invalidation is needed, it would be implemented here (e.g., blacklisting).
      res.status(200).json({ message: 'Customer logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async registerAdmin(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { admin, accessToken, refreshToken } = await AuthService.registerAdmin({ name, email, password });
      res.status(201).json({ message: 'Admin registered successfully', admin, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async loginAdmin(req, res, next) {
    try {
      const { email, password } = req.body;
      const { admin, accessToken, refreshToken } = await AuthService.loginAdmin({ email, password });
      res.status(200).json({ message: 'Admin logged in successfully', admin, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async refreshAdminToken(req, res, next) {
    try {
      const { refreshToken: oldRefreshToken } = req.body;
      const { accessToken, refreshToken } = await AuthService.refreshAdminToken(oldRefreshToken);
      res.status(200).json({ message: 'Admin token refreshed successfully', accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async logoutAdmin(req, res, next) {
    try {
      // For JWT, logout is typically handled client-side by discarding tokens.
      // If server-side token invalidation is needed, it would be implemented here (e.g., blacklisting).
      res.status(200).json({ message: 'Admin logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
