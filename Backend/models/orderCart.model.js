import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProduct",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

// Check if product exists in cart
cartSchema.methods.hasProduct = function (productId) {
  return this.items.some(
    (item) => item.productId.toString() === productId.toString()
  );
};

// Get item by productId
cartSchema.methods.getItem = function (productId) {
  return this.items.find(
    (item) => item.productId.toString() === productId.toString()
  );
};

// Add or update item in cart
cartSchema.methods.addItem = async function (productId, quantity = 1) {
  const existingItem = this.getItem(productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      productId,
      quantity,
    });
  }

  return await this.save();
};

// Update item quantity
cartSchema.methods.updateQuantity = async function (productId, quantity) {
  const item = this.getItem(productId);

  if (!item) {
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    this.items = this.items.filter(
      (i) => i.productId.toString() !== productId.toString()
    );
  } else {
    item.quantity = quantity;
  }

  return await this.save();
};

// Remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  return await this.save();
};

// Clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  return await this.save();
};

// Get cart with all calculations
cartSchema.methods.getCartSummary = async function () {
  await this.populate({
    path: "items.productId",
    select: "name price stock category images deliveryCharge brand weight",
  });

  let subtotal = 0;
  let totalDeliveryCharge = 0;
  let itemCount = 0;
  let outOfStockItems = [];

  this.items.forEach((item) => {
    if (item.productId) {
      const product = item.productId;
      subtotal += product.price * item.quantity;
      totalDeliveryCharge += product.deliveryCharge || 0;
      itemCount += item.quantity;

      if (item.quantity > product.stock) {
        outOfStockItems.push({
          productId: product._id,
          name: product.name,
          requested: item.quantity,
          available: product.stock,
        });
      }
    }
  });

  const tax = Math.round(subtotal * 0.12); // 12% GST
  const grandTotal = subtotal + totalDeliveryCharge + tax;

  return {
    items: this.items,
    subtotal,
    deliveryCharge: totalDeliveryCharge,
    tax,
    grandTotal,
    itemCount,
    outOfStockItems,
    isEmpty: this.items.length === 0,
  };
};

// Find or create cart for user
cartSchema.statics.findOrCreate = async function (userId) {
  let cart = await this.findOne({ userId });

  if (!cart) {
    cart = await this.create({
      userId,
      items: [],
    });
  }

  return cart;
};

// Get cart with populated products
cartSchema.statics.getCartWithProducts = async function (userId) {
  return await this.findOne({ userId }).populate({
    path: "items.productId",
    select:
      "name price stock category images deliveryCharge brand weight dimensions sku warranty returnPolicyDays",
  });
};

cartSchema.index({ userId: 1 });
cartSchema.index({ lastUpdated: 1 });

// Auto-delete cart after 90 days of inactivity
cartSchema.index(
  { lastUpdated: 1 },
  {
    expireAfterSeconds: 7776000, // 90 days
  }
);

// Check if cart is empty
cartSchema.virtual("isEmpty").get(function () {
  return this.items.length === 0;
});

// Ensure virtuals are included in JSON
cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

export const Cart = mongoose.model("Cart", cartSchema);

