const OrderRepository = require('../repositories/orderRepository');
const CartRepository = require('../repositories/cartRepository');
const ProductRepository = require('../repositories/productRepository');
const CouponRepository = require('../repositories/couponRepository'); // Assuming a CouponRepository exists

class OrderService {
  static async createOrder(customerId, orderData, cartItems) {
    const { customer_name, delivery_address, customer_contact, customer_email, payment_method, notes, couponCode } = orderData;
    
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += item.price * item.quantity;
    }

    let discountAmount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await CouponRepository.findByCode(couponCode);
      if (coupon && coupon.is_active && new Date() >= new Date(coupon.valid_from) && new Date() <= new Date(coupon.valid_until) && coupon.used_count < coupon.usage_limit) {
        // Apply coupon logic
        // For simplicity, assuming percentage or fixed amount discount on total
        if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
          throw new Error('Minimum order amount not met for this coupon');
        }

        if (coupon.type === 'percentage') {
          discountAmount = subtotal * (coupon.value / 100);
          if (coupon.max_discount && discountAmount > coupon.max_discount) {
            discountAmount = coupon.max_discount;
          }
        } else if (coupon.type === 'fixed_amount') {
          discountAmount = coupon.value;
        }
        await CouponRepository.incrementUsedCount(coupon.id);
      } else if (coupon) {
        throw new Error('Invalid or expired coupon');
      } else {
        throw new Error('Coupon not found');
      }
    }

    // Assume delivery charge is a fixed value for now, or fetched from settings
    const deliveryCharge = 50; // Example fixed delivery charge

    const totalAmount = subtotal + deliveryCharge - discountAmount;

    const order_number = `ORD-${Date.now()}`;
    const newOrder = await OrderRepository.createOrder({
      order_number,
      customer_id: customerId,
      customer_name,
      delivery_address,
      customer_contact,
      customer_email,
      subtotal,
      delivery_charge: deliveryCharge,
      discount_amount: discountAmount,
      coupon_id: coupon ? coupon.id : null,
      total_amount: totalAmount,
      payment_method,
      payment_status: payment_method === 'COD' ? 'pending' : 'pending', // Payment gateway integration would change this
      order_status: 'placed',
      notes,
    });

    for (const item of cartItems) {
      await OrderRepository.createOrderItem({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      });
      await OrderRepository.updateProductStock(item.product_id, -item.quantity); // Decrease stock
    }

    await CartRepository.clearCart(customerId); // Clear customer's cart after order

    return newOrder;
  }

  static async getCustomerOrders(customerId) {
    return OrderRepository.getOrdersByCustomerId(customerId);
  }

  static async getCustomerOrderDetails(orderId, customerId) {
    const order = await OrderRepository.getOrderById(orderId, customerId);
    if (!order) {
      throw new Error('Order not found');
    }
    const items = await OrderRepository.getOrderItems(orderId);
    return { ...order, items };
  }
}

module.exports = OrderService;
