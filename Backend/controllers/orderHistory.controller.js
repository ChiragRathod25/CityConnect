// controllers/orderController.js
import Order from '../models/orderHistory.model';

// ============================================
// GET ALL ORDERS (with search & filters)
// ============================================
export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { page = 1, limit = 3, status, dateFilter, search } = req.query;

    // Build query
    let query = { userId };

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by date
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      let daysAgo;

      if (dateFilter === 'week') daysAgo = 7;
      if (dateFilter === 'month') daysAgo = 30;
      if (dateFilter === '3months') daysAgo = 90;
      if (dateFilter === '6months') daysAgo = 180;

      const startDate = new Date(now.setDate(now.getDate() - daysAgo));
      query.orderDate = { $gte: startDate };
    }

    // Search by order ID or product name
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// ============================================
// GET SINGLE ORDER BY ID
// ============================================
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// ============================================
// CREATE NEW ORDER (from cart)
// ============================================
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      items,
      subtotal,
      deliveryCharge,
      tax,
      discount,
      totalAmount,
      deliveryAddress,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Calculate estimated delivery date (7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    // Create order
    const order = await Order.create({
      userId,
      items,
      subtotal,
      deliveryCharge,
      tax,
      discount: discount || 0,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'processing',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pending' : 'completed',
      estimatedDeliveryDate: estimatedDelivery
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// ============================================
// UPDATE ORDER STATUS (Admin/Seller)
// ============================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;

    // Set delivery date if status is delivered
    if (status === 'delivered' && !order.deliveryDate) {
      order.deliveryDate = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// ============================================
// CANCEL ORDER (User)
// ============================================
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const { cancelReason } = req.body;

    const order = await Order.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${order.status} order`
      });
    }

    order.status = 'cancelled';
    order.cancelReason = cancelReason || 'Cancelled by user';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// ============================================
// REORDER (Create new order from old one)
// ============================================
export const reorder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const oldOrder = await Order.findOne({ orderId, userId });

    if (!oldOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Calculate new totals
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    // Create new order with same items
    const newOrder = await Order.create({
      userId,
      items: oldOrder.items,
      subtotal: oldOrder.subtotal,
      deliveryCharge: oldOrder.deliveryCharge,
      tax: oldOrder.tax,
      discount: oldOrder.discount,
      totalAmount: oldOrder.totalAmount,
      deliveryAddress: oldOrder.deliveryAddress,
      paymentMethod: oldOrder.paymentMethod,
      status: 'processing',
      paymentStatus: 'pending',
      estimatedDeliveryDate: estimatedDelivery
    });

    res.status(201).json({
      success: true,
      message: 'Reorder placed successfully',
      order: newOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reorder',
      error: error.message
    });
  }
};

// ============================================
// DOWNLOAD INVOICE
// ============================================
export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Here you can generate PDF invoice
    // For now, just return order data
    res.status(200).json({
      success: true,
      message: 'Invoice data',
      invoice: {
        orderId: order.orderId,
        orderDate: order.orderDate,
        items: order.items,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        tax: order.tax,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice',
      error: error.message
    });
  }
};

// ============================================
// GET ORDER STATISTICS (optional)
// ============================================
export const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalOrders = await Order.countDocuments({ userId });
    const deliveredOrders = await Order.countDocuments({ userId, status: 'delivered' });
    const processingOrders = await Order.countDocuments({ userId, status: 'processing' });
    const cancelledOrders = await Order.countDocuments({ userId, status: 'cancelled' });

    // Calculate total spent
    const orders = await Order.find({ userId, status: 'delivered' });
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        deliveredOrders,
        processingOrders,
        cancelledOrders,
        totalSpent
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};