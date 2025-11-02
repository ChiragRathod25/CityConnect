// models/Order.js
import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "BusinessProduct",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
  weight: String,
  brand: String,
});

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      // Auto-generate: ORD-YYYY-XXX
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [orderItemSchema],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    // Delivery
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String,
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: [
        "Credit Card",
        "Debit Card",
        "UPI",
        "Cash on Delivery",
        "Net Banking",
      ],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: String,

    // Dates
    orderDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    deliveryDate: Date,
    estimatedDeliveryDate: Date,

    // Additional
    notes: String,
    cancelReason: String,
    invoiceUrl: String,
  },
  {
    timestamps: true, 
  }
);

// Index for faster queries
orderSchema.index({ userId: 1, orderDate: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1, orderDate: -1 });

// Auto-generate orderId before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const year = new Date().getFullYear();
    const count = await model("Order").countDocuments();
    this.orderId = `ORD-${year}-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

const Order = model("OrderHistories", orderSchema);

export default Order;
