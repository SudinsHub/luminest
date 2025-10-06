const pool = require('../config/db');

class AdminCarouselRepository {
  static async createCarouselImage({ imageUrl, altText, displayOrder, isActive, link_url }) {
    const res = await pool.query(
      'INSERT INTO carousel_images (image_url, alt_text, display_order, is_active, link_url) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
      [imageUrl, altText, displayOrder, isActive, link_url]
    );
    return res.rows[0]; 
  }

  static async getAllCarouselImages() {
    const res = await pool.query('SELECT * FROM carousel_images ORDER BY display_order ASC');
    return res.rows;
  }

  static async getCarouselImageById(id) {
    const res = await pool.query('SELECT * FROM carousel_images WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async updateCarouselImage(id, { imageUrl, altText, displayOrder, isActive }) { 
    const res = await pool.query(
      'UPDATE carousel_images SET image_url = $1, alt_text = $2, display_order = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING * ',
      [imageUrl, altText, displayOrder, isActive, id]
    );
    return res.rows[0];
  }

  static async deleteCarouselImage(id) {
    await pool.query('DELETE FROM carousel_images WHERE id = $1', [id]);
  }

  static async updateCarouselOrder(updates) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const update of updates) {
        await client.query(
          'UPDATE carousel_images SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [update.display_order, update.id]
        );
      }
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = AdminCarouselRepository;
