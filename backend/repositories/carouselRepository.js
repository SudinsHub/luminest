const pool = require('../config/db');

class CarouselRepository {
  static async getActiveCarouselImages() {
    const res = await pool.query(
      'SELECT id, image_url, alt_text, link_url, display_order FROM carousel_images WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    return res.rows;
  }
}

module.exports = CarouselRepository;
