const pool = require('../config/db');

class AdminProductTagRepository {
  static async getProductTags(productId) { // lagbe
    const res = await pool.query(
      'SELECT pt.id, pt.tag_name FROM product_tags pt WHERE pt.product_id = $1',
      [productId]
    );
    return res.rows;
  }

  static async getTags() { // lagbe
    const res = await pool.query(
      'SELECT * FROM tags'
    );
    return res.rows;
  } 

  static async addProductTag(productId, tagName) { // lagbe
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('INSERT INTO tags (tag_name) VALUES ($1) ON CONFLICT (tag_name) DO NOTHING', [tagName]);
      const res = await client.query(
        'INSERT INTO product_tags (product_id, tag_name) VALUES ($1, $2) ON CONFLICT (product_id, tag_name) DO NOTHING RETURNING * ',
        [productId, tagName]
      );

      await client.query('COMMIT');
      return res.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteProductTag(tagId) { // lagbe
    await pool.query('DELETE FROM product_tags WHERE id = $1', [tagId]);
  }

  static async getTagById(tagId) { // lagteo pare
    const res = await pool.query('SELECT * FROM product_tags WHERE id = $1', [tagId]);
    return res.rows[0];
  }

  static async addTag(tagName) { // lagbe
    const res = await pool.query(
      'INSERT INTO tags (tag_name) VALUES ($1) ON CONFLICT (tag_name) DO NOTHING RETURNING *',
      [tagName]
    );
    return res.rows[0];
  }

  static async deleteTag(tagName){
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM tags WHERE tag_name = $1', [tagName]);
      await client.query('DELETE FROM product_tags WHERE tag_name = $1', [tagName]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async editTag(oldTagName, newTagName){
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE tags SET tag_name = $1 WHERE tag_name = $2', [newTagName, oldTagName]);
      await client.query('UPDATE product_tags SET tag_name = $1 WHERE tag_name = $2', [newTagName, oldTagName]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

}

module.exports = AdminProductTagRepository;
