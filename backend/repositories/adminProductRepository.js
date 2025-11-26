const pool = require('../config/db');

class AdminProductRepository {
  static async createProduct({ title, description, price, stock_quantity, images, categoryIds, tags }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const productRes = await client.query(
        'INSERT INTO products (title, description, price, stock_quantity, images) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
        [title, description, price, stock_quantity, images]
      );
      const product = productRes.rows[0];
      if(!Array.isArray(categoryIds)) categoryIds = [categoryIds]
      if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          await client.query('INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)', [product.id, categoryId]);
        }
      }
      
      if(!Array.isArray(tags)) tags = [tags]
      if (tags && tags.length > 0) { 
        for (const tagName of tags) {
          // Ensure tag exists or create it
          await client.query('INSERT INTO tags (tag_name) VALUES ($1) ON CONFLICT (tag_name) DO NOTHING', [tagName]);
          await client.query('INSERT INTO product_tags (product_id, tag_name) VALUES ($1, $2) ON CONFLICT (product_id, tag_name) DO NOTHING', [product.id, tagName]);
        }
      }

      await client.query('COMMIT');
      return product;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAllProductsWithCategory() {
    const res = await pool.query(
      'SELECT p.*, ARRAY_AGG(DISTINCT c.name) AS categories, ARRAY_AGG(DISTINCT t.tag_name) AS tags FROM products p LEFT JOIN product_categories pc ON p.id = pc.product_id LEFT JOIN categories c ON pc.category_id = c.id LEFT JOIN product_tags pt ON p.id = pt.product_id LEFT JOIN tags t ON pt.tag_name = t.tag_name GROUP BY p.id ORDER BY p.created_at DESC'
    );
    return res.rows;
  }

    //   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    // title VARCHAR(255) NOT NULL,
    // description TEXT,
    // price DECIMAL(10, 2) NOT NULL,
    // stock_quantity INTEGER DEFAULT 0,
    // images TEXT[]
  
  static async getAllProducts() {
    const res = await pool.query(
      'SELECT p.id, p.title, p.stock_quantity, p.images, ARRAY_AGG(DISTINCT t.tag_name) AS tags FROM products p LEFT JOIN product_tags pt ON p.id = pt.product_id LEFT JOIN tags t ON pt.tag_name = t.tag_name GROUP BY p.id ORDER BY p.created_at DESC'
    );
    return res.rows;
  }
  
  static async getProductById(id) {
    const res = await pool.query(
      'SELECT p.*, ARRAY_AGG(DISTINCT c.id) AS category_ids, ARRAY_AGG(DISTINCT t.tag_name) AS tags FROM products p LEFT JOIN product_categories pc ON p.id = pc.product_id LEFT JOIN categories c ON pc.category_id = c.id LEFT JOIN product_tags pt ON p.id = pt.product_id LEFT JOIN tags t ON pt.tag_name = t.tag_name WHERE p.id = $1 GROUP BY p.id',
      [id]
    );
    return res.rows[0];
  }

  static async updateProduct(id, { title, description, price, stock_quantity, images, categoryIds, tags }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const productRes = await client.query(
        'UPDATE products SET title = $1, description = $2, price = $3, stock_quantity = $4, images = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING * ',
        [title, description, price, stock_quantity, images, id]
      );
      const updatedProduct = productRes.rows[0];

      // Update categories
      await client.query('DELETE FROM product_categories WHERE product_id = $1', [id]);
      if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          await client.query('INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)', [id, categoryId]);
        }
      }

      // Update tags
      await client.query('DELETE FROM product_tags WHERE product_id = $1', [id]);
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          await client.query('INSERT INTO tags (tag_name) VALUES ($1) ON CONFLICT (tag_name) DO NOTHING', [tagName]);
          await client.query('INSERT INTO product_tags (product_id, tag_name) VALUES ($1, $2) ON CONFLICT (product_id, tag_name) DO NOTHING', [id, tagName]);
        }
      }

      await client.query('COMMIT');
      return updatedProduct;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteProduct(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
  }

  static async addProductImage(productId, imageUrl) {
    const res = await pool.query(
      'UPDATE products SET images = array_append(images, $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING images',
      [imageUrl, productId]
    );
    return res.rows[0].images;
  }

  static async deleteProductImage(productId, imageUrl) {
    const res = await pool.query(
      'UPDATE products SET images = array_remove(images, $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING images',
      [imageUrl, productId]
    );
    return res.rows[0].images;
  }

  static async getProductImageById(productId, imageUrl) {
    const res = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND $2 = ANY(images)',
      [productId, imageUrl]
    );
    return res.rows[0];
  }
}

module.exports = AdminProductRepository;
