const CartRepository = require('../repositories/cartRepository');
const ProductRepository = require('../repositories/productRepository'); // Assuming a ProductRepository exists

class CartService {
  static async getCart(customerId) {
    return CartRepository.getCartItems(customerId);
  }

  static async addItem(customerId, productId, quantity) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.stock_quantity < quantity) {
      throw new Error('Insufficient stock');
    }
    return CartRepository.addCartItem(customerId, productId, quantity);
  }

  static async updateItem(itemId, customerId, quantity) {
    const cartItem = await CartRepository.getCartItemById(itemId, customerId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    const product = await ProductRepository.findById(cartItem.product_id);
    if (product.stock_quantity < quantity) {
      throw new Error('Insufficient stock');
    }
    return CartRepository.updateCartItem(itemId, customerId, quantity);
  }

  static async removeItem(itemId, customerId) {
    await CartRepository.removeCartItem(itemId, customerId);
  }

  static async clearCart(customerId) {
    await CartRepository.clearCart(customerId);
  }
}

module.exports = CartService;
