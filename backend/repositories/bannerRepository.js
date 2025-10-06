const pool = require('../config/db');

class BannerRepository {
  static async getActiveBanner() {
    const res = await pool.query('SELECT id, message FROM banner WHERE is_active = TRUE');
    return res.rows[0];
  }
}

module.exports = BannerRepository;
