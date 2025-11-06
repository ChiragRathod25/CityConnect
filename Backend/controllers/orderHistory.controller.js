import Order from '../models/orderHistory.model';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 3, status, dateFilter, search } = req.query;

  let query = { userId };

  if (status && status !== 'all') {
    query.status = status;
  }

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

  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: 'i' } },
      { 'items.name': { $regex: search, $options: 'i' } }
    ];
  }

  const orders = await Order.find(query)
    .sort({ orderDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalOrders = await Order.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      orders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders
    })
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const order = await Order.findOne({ orderId, userId });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return res.status(200).json(
    new ApiResponse(200, { order })
  );
});

const createOrder = asyncHandler(async (req, res) => {
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

  if (!items || items.length === 0) {
    throw new ApiError(400, 'No items in order');
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

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

  return res.status(201).json(
    new ApiResponse(201, { order }, 'Order placed successfully')
  );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const order = await Order.findOne({ orderId });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.status = status;

  if (status === 'delivered' && !order.deliveryDate) {
    order.deliveryDate = new Date();
  }

  await order.save();

  return res.status(200).json(
    new ApiResponse(200, { order }, 'Order status updated successfully')
  );
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;
  const { cancelReason } = req.body;

  const order = await Order.findOne({ orderId, userId });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    throw new ApiError(400, `Cannot cancel ${order.status} order`);
  }

  order.status = 'cancelled';
  order.cancelReason = cancelReason || 'Cancelled by user';
  await order.save();

  return res.status(200).json(
    new ApiResponse(200, { order }, 'Order cancelled successfully')
  );
});

const reorder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const oldOrder = await Order.findOne({ orderId, userId });

  if (!oldOrder) {
    throw new ApiError(404, 'Order not found');
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

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

  return res.status(201).json(
    new ApiResponse(201, { order: newOrder }, 'Reorder placed successfully')
  );
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const order = await Order.findOne({ orderId, userId });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return res.status(200).json(
    new ApiResponse(200, {
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
    }, 'Invoice data')
  );
});

const getOrderStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const totalOrders = await Order.countDocuments({ userId });
  const deliveredOrders = await Order.countDocuments({ userId, status: 'delivered' });
  const processingOrders = await Order.countDocuments({ userId, status: 'processing' });
  const cancelledOrders = await Order.countDocuments({ userId, status: 'cancelled' });

  const orders = await Order.find({ userId, status: 'delivered' });
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return res.status(200).json(
    new ApiResponse(200, {
      stats: {
        totalOrders,
        deliveredOrders,
        processingOrders,
        cancelledOrders,
        totalSpent
      }
    })
  );
});

export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  reorder,
  downloadInvoice,
  getOrderStats
  
}