// models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  image: {
    type: String,
    required: true
  },
  weight: String,
  brand: String,
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  distance: String, // For local business (e.g., "0.5 km")
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  _id: false // No separate _id for cart items
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One cart per user
    index: true
  },
  items: {
    type: [cartItemSchema],
    default: []
  },
  // Calculated fields (can be computed on-the-fly too)
  subtotal: {
    type: Number,
    default: 0
  },
  totalSavings: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// ============================================
// MIDDLEWARE - Update totals before saving
// ============================================
cartSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    // Calculate subtotal
    this.subtotal = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Calculate total savings
    this.totalSavings = this.items.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      const savings = (originalPrice - item.price) * item.quantity;
      return sum + savings;
    }, 0);

    // Calculate item count
    this.itemCount = this.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
  } else {
    this.subtotal = 0;
    this.totalSavings = 0;
    this.itemCount = 0;
  }

  this.lastUpdated = Date.now();
  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

// Get cart summary with delivery and tax
cartSchema.methods.getCartSummary = function() {
  const deliveryCharge = this.subtotal > 500 ? 0 : 50;
  const tax = Math.round(this.subtotal * 0.12); // 12% GST
  const grandTotal = this.subtotal + deliveryCharge + tax;

  return {
    subtotal: this.subtotal,
    totalSavings: this.totalSavings,
    deliveryCharge,
    tax,
    grandTotal,
    itemCount: this.itemCount,
    freeDeliveryEligible: this.subtotal > 500
  };
};

// Check if product exists in cart
cartSchema.methods.hasProduct = function(productId) {
  return this.items.some(item => 
    item.productId.toString() === productId.toString()
  );
};

// Get item by productId
cartSchema.methods.getItem = function(productId) {
  return this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
};

// ============================================
// STATIC METHODS
// ============================================

// Find or create cart for user
cartSchema.statics.findOrCreate = async function(userId) {
  let cart = await this.findOne({ userId });
  
  if (!cart) {
    cart = await this.create({ 
      userId, 
      items: [] 
    });
  }
  
  return cart;
};

// Get cart with populated product details
cartSchema.statics.getCartWithProducts = async function(userId) {
  return await this.findOne({ userId })
    .populate({
      path: 'items.productId',
      select: 'name price originalPrice inStock category images'
    });
};

// ============================================
// INDEXES
// ============================================
cartSchema.index({ userId: 1 });
cartSchema.index({ lastUpdated: 1 });

// Auto-delete cart after 90 days of inactivity (optional)
cartSchema.index({ lastUpdated: 1 }, { 
  expireAfterSeconds: 7776000 // 90 days
});

// ============================================
// VIRTUAL FIELDS
// ============================================

// Virtual to check if cart is empty
cartSchema.virtual('isEmpty').get(function() {
  return this.items.length === 0;
});

// Virtual to get out of stock items
cartSchema.virtual('outOfStockItems').get(function() {
  return this.items.filter(item => !item.inStock);
});

// Ensure virtuals are included in JSON
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

export default mongoose.model('Cart', cartSchema);