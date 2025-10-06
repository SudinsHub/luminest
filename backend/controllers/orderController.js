const OrderService = require('../services/orderService');
const CartService = require('../services/cartService');

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const customerId = req.user.id;
      const cartItems = await CartService.getCart(customerId);

      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty, cannot place an order.' });
      }

      const order = await OrderService.createOrder(customerId, req.body, cartItems);
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req, res, next) {
    try {
      const customerId = req.user.id;
      const orders = await OrderService.getCustomerOrders(customerId);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const customerId = req.user.id;
      const { orderId } = req.params;
      const order = await OrderService.getCustomerOrderDetails(orderId, customerId);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
