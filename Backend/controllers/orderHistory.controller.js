import Order from "../models/orderHistory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getAllOrdersByUserId = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 3, status, dateFilter, search } = req.query;

  let query = { userId };

  if (status && status !== "all") {
    query.status = status;
  }

  if (dateFilter && dateFilter !== "all") {
    const now = new Date();
    let daysAgo;

    if (dateFilter === "week") daysAgo = 7;
    if (dateFilter === "month") daysAgo = 30;
    if (dateFilter === "3months") daysAgo = 90;
    if (dateFilter === "6months") daysAgo = 180;

    const startDate = new Date(now.setDate(now.getDate() - daysAgo));
    query.orderDate = { $gte: startDate };
  }

  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: "i" } },
      { "items.name": { $regex: search, $options: "i" } },
    ];
  }

  const orders = await Order.find(query)
    .sort({ orderDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalOrders = await Order.countDocuments(query);
  console.log("Response Orders:", {
    orders,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalOrders / limit),
    totalOrders,
  });

  return res.status(200).json(
    new ApiResponse(200, "Orders retrieved successfully", {
      orders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    })
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const order = await Order.findOne({ orderId, userId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(new ApiResponse(200, { order }));
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
    paymentMethod,
    transactionId,
  } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, "No items in order");
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
    transactionId,
    status: "processing",
    paymentStatus:
      paymentMethod === "Cash on Delivery" ? "pending" : "completed",
    estimatedDeliveryDate: estimatedDelivery,
    orderDate: new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { order }, "Order placed successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await Order.findOne({ orderId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;

  if (status === "delivered" && !order.deliveryDate) {
    order.deliveryDate = new Date();
  }

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { order }, "Order status updated successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;
  const { cancelReason } = req.body;

  const order = await Order.findOne({ orderId, userId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === "delivered" || order.status === "cancelled") {
    throw new ApiError(400, `Cannot cancel ${order.status} order`);
  }

  order.status = "cancelled";
  order.cancelReason = cancelReason || "Cancelled by user";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { order }, "Order cancelled successfully"));
});

const reorder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const oldOrder = await Order.findOne({ orderId, userId });

  if (!oldOrder) {
    throw new ApiError(404, "Order not found");
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
    status: "processing",
    paymentStatus: "pending",
    estimatedDeliveryDate: estimatedDelivery,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { order: newOrder }, "Reorder placed successfully")
    );
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const order = await Order.findOne({ orderId, userId });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        invoice: {
          orderId: order.orderId,
          orderDate: order.orderDate,
          items: order.items,
          subtotal: order.subtotal,
          deliveryCharge: order.deliveryCharge,
          tax: order.tax,
          totalAmount: order.totalAmount,
          deliveryAddress: order.deliveryAddress,
          paymentMethod: order.paymentMethod,
        },
      },
      "Invoice data"
    )
  );
});

const getOrderStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const totalOrders = await Order.countDocuments({ userId });
  const deliveredOrders = await Order.countDocuments({
    userId,
    status: "delivered",
  });
  const processingOrders = await Order.countDocuments({
    userId,
    status: "processing",
  });
  const cancelledOrders = await Order.countDocuments({
    userId,
    status: "cancelled",
  });

  const orders = await Order.find({ userId, status: "delivered" });
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const uniqueCustomers = await Order.distinct("userId");
  const totalCustomers = uniqueCustomers.length;

  return res.status(200).json(
    new ApiResponse(200, "Stats retrieved successfully", {
      stats: {
        totalOrders,
        deliveredOrders,
        processingOrders,
        cancelledOrders,
        totalSpent,
        totalCustomers,
      },
    })
  );
});

const getAdminOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });
  const processingOrders = await Order.countDocuments({ status: "processing" });
  const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

  const orders = await Order.find({ status: "delivered" });
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const uniqueCustomers = await Order.distinct("userId");
  const totalCustomers = uniqueCustomers.length;

  return res.status(200).json(
    new ApiResponse(200, "Admin stats retrieved successfully", {
      stats: {
        totalOrders,
        deliveredOrders,
        processingOrders,
        cancelledOrders,
        totalRevenue,
        totalCustomers,
      },
    })
  );
});

const getOrderByBusinessId = asyncHandler(async (req, res) => {
  //get orders by business id
  //use aggregation piplines
  //fetch products and match their business id and return orders
  //also include user details in the response , user who placed the order

  const { businessId } = req.params;
  if (!businessId) {
    throw new ApiError(400, "Business ID is required");
  }

  console.log("Fetching orders for business ID:", businessId);
  const orders = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "businessproducts",
        localField: "items.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $match: {
        "productDetails.businessId": new mongoose.Types.ObjectId(businessId)
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $group: {
        _id: "$_id",
        orderId: { $first: "$orderId" },
        userId: { $first: "$userId" },
        userDetails: { $first: "$userDetails" },
        items: { $push: "$items" },
        subtotal: { $first: "$subtotal" },
        deliveryCharge: { $first: "$deliveryCharge" },
        tax: { $first: "$tax" },
        discount: { $first: "$discount" },
        totalAmount: { $first: "$totalAmount" },
        deliveryAddress: { $first: "$deliveryAddress" },
        paymentMethod: { $first: "$paymentMethod" },
        transactionId: { $first: "$transactionId" },
        status: { $first: "$status" },
        paymentStatus: { $first: "$paymentStatus" },
        estimatedDeliveryDate: { $first: "$estimatedDeliveryDate" },
        orderDate: { $first: "$orderDate" },
      },
    },
  ]);

  //calculate total sales for the business, totalOrders, totalCustomers
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((order) => order.userId)).size;


  console.log("Business Orders:", {
    orders,
    stats: {
      totalSales,
      totalOrders,
      totalCustomers,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Orders retrieved successfully", {
      orders,
      stats: {
        totalSales,
        totalOrders,
        totalCustomers,
      },
    })
  );
});

export {
  getAllOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  reorder,
  downloadInvoice,
  getOrderStats,
  getAdminOrderStats,
  getOrderByBusinessId,
};
