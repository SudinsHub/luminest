const pool = require('../config/db');

class PublicProductRepository {
  static async getAllProducts({ page, limit, categoryId, minPrice, maxPrice, rating, sort, search, tag }) {
    let query = `
      SELECT 
        p.id, p.title, p.description, p.price, p.stock_quantity, p.images, p.average_rating, p.total_reviews, p.created_at, p.updated_at,
        ARRAY_AGG(DISTINCT c.name) AS categories,
        ARRAY_AGG(DISTINCT t.tag_name) AS tags
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_name = t.tag_name
    `;
    const queryParams = [];
    const conditions = [];

    if (categoryId) {
      conditions.push('pc.category_id = $1');
      queryParams.push(categoryId);
    }
    if (minPrice) {
      conditions.push(`p.price >= $${queryParams.length + 1}`);
      queryParams.push(minPrice);
    }
    if (maxPrice) {
      conditions.push(`p.price <= $${queryParams.length + 1}`);
      queryParams.push(maxPrice);
    }
    if (rating) {
      conditions.push(`p.average_rating >= $${queryParams.length + 1}`);
      queryParams.push(rating);
    }
    if (search) {
      conditions.push(`(p.title ILIKE $${queryParams.length + 1} OR p.description ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${search}%`);
    }
    if (tag) {
      conditions.push(`t.tag_name = $${queryParams.length + 1}`);
      queryParams.push(tag);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY p.id';

    if (sort) {
      switch (sort) {
        case 'price_asc':
          query += ' ORDER BY p.price ASC';
          break;
        case 'price_desc':
          query += ' ORDER BY p.price DESC';
          break;
        case 'rating_desc':
          query += ' ORDER BY p.average_rating DESC';
          break;
        case 'newest':
          query += ' ORDER BY p.created_at DESC';
          break;
        case 'oldest':
          query += ' ORDER BY p.created_at ASC';
          break;
        case 'name_asc':
          query += ' ORDER BY p.title ASC';
          break;
        case 'name_desc':
          query += ' ORDER BY p.title DESC';
          break;
        default:
          query += ' ORDER BY p.created_at DESC';
      }
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    const offset = (page - 1) * limit;
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const res = await pool.query(query, queryParams);
    return res.rows;
  }

  static async getProductById(id) {
    const res = await pool.query(
      'SELECT p.*, ARRAY_AGG(DISTINCT c.name) AS categories, ARRAY_AGG(DISTINCT t.tag_name) AS tags FROM products p LEFT JOIN product_categories pc ON p.id = pc.product_id LEFT JOIN categories c ON pc.category_id = c.id LEFT JOIN product_tags pt ON p.id = pt.product_id LEFT JOIN tags t ON pt.tag_name = t.tag_name WHERE p.id = $1 GROUP BY p.id',
      [id]
    );
    return res.rows[0];
  }

  static async getProductsByTag(tagName) {
    const res = await pool.query(
      'SELECT p.*, ARRAY_AGG(DISTINCT c.name) AS categories FROM products p JOIN product_tags pt ON p.id = pt.product_id JOIN tags t ON pt.tag_name = t.tag_name LEFT JOIN product_categories pc ON p.id = pc.product_id LEFT JOIN categories c ON pc.category_id = c.id WHERE t.tag_name = $1 GROUP BY p.id',
      [tagName]
    );
    return res.rows;
  }

  static async getProductsByCategoryId(categoryId) {
    const res = await pool.query(
      'SELECT p.*, ARRAY_AGG(DISTINCT t.tag_name) AS tags FROM products p JOIN product_categories pc ON p.id = pc.product_id LEFT JOIN product_tags pt ON p.id = pt.product_id LEFT JOIN tags t ON pt.tag_name = t.tag_name WHERE pc.category_id = $1 GROUP BY p.id',
      [categoryId]
    );
    return res.rows;
  }

  static async getProductsByCategoryLatestLimited(categoryName) {
    const res = await pool.query(
      'SELECT p.*, ARRAY_AGG(DISTINCT t.tag_name) AS tags' + 
      'FROM products p' +
      'JOIN product_categories pc ON p.id = pc.product_id ' +
      'LEFT JOIN product_tags pt ON p.id = pt.product_id ' +
      'LEFT JOIN tags t ON pt.tag_name = t.tag_name ' +
      'LEFT JOIN categories c ON pc.category_id = c.id ' +
      'WHERE c.name = $1 ' +
      'GROUP BY p.id '+
      'ORDER BY p.created_at DESC LIMIT 5',
      [categoryName]
    );
    return res.rows;
  }
}

module.exports = PublicProductRepository;
