const AdminOrderService = require('../services/adminOrderService');

class AdminOrderController {
  static async getOrders(req, res, next) {
    try {
      const orders = await AdminOrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await AdminOrderService.getOrderDetails(id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await AdminOrderService.updateOrderStatus(id, status);
      res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
      next(error);
    }
  }

  static async generateBillPdf(req, res, next) {
    try {
      const { id } = req.params;
      const pdfPath = await AdminOrderService.generateBillPdf(id);
      res.status(200).json({ message: 'Bill PDF generated', path: pdfPath });
    } catch (error) {
      next(error);
    }
  }

  static async generateShippingLabel(req, res, next) {
    try {
      const { id } = req.params;
      const pdfPath = await AdminOrderService.generateShippingLabel(id);
      res.status(200).json({ message: 'Shipping label PDF generated', path: pdfPath });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminOrderController;
