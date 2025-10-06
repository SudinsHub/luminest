const CartService = require('../services/cartService');

class CartController {
  static async getCart(req, res, next) {
    try {
      const customerId = req.user.id;
      const cart = await CartService.getCart(customerId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req, res, next) {
    try {
      const customerId = req.user.id;
      const { productId, quantity } = req.body;
      const cartItem = await CartService.addItem(customerId, productId, quantity);
      res.status(201).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req, res, next) {
    try {
      const customerId = req.user.id;
      const { itemId } = req.params;
      const { quantity } = req.body;
      const updatedCartItem = await CartService.updateItem(itemId, customerId, quantity);
      res.status(200).json({ message: 'Cart item updated', cartItem: updatedCartItem });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req, res, next) {
    try {
      const customerId = req.user.id;
      const { itemId } = req.params;
      await CartService.removeItem(itemId, customerId);
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    try {
      const customerId = req.user.id;
      await CartService.clearCart(customerId);
      res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
