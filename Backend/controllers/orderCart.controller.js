// controllers/cartController.js
import Cart from '../models/Cart.js';
import Product from '../models/Product.js'; // Assuming you have a Product model

// ============================================
// GET USER CART
// ============================================
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOrCreate(userId);

    res.status(200).json({
      success: true,
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// ============================================
// ADD ITEM TO CART
// ============================================
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      productId,
      name,
      category,
      price,
      originalPrice,
      discount,
      quantity = 1,
      image,
      weight,
      brand,
      rating,
      reviewCount,
      distance,
      inStock = true
    } = req.body;

    // Validate required fields
    if (!productId || !name || !category || !price || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Optional: Verify product exists and is in stock
    // const product = await Product.findById(productId);
    // if (!product) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Product not found'
    //   });
    // }

    const cart = await Cart.findOrCreate(userId);

    // Check if item already exists in cart
    const existingItem = cart.getItem(productId);

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        name,
        category,
        price,
        originalPrice: originalPrice || price,
        discount: discount || 0,
        quantity,
        image,
        weight,
        brand,
        rating,
        reviewCount,
        distance,
        inStock
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// ============================================
// UPDATE CART ITEM QUANTITY
// ============================================
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item in cart
    const item = cart.getItem(productId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update quantity
    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item quantity updated',
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// ============================================
// REMOVE ITEM FROM CART
// ============================================
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if item exists
    const itemExists = cart.hasProduct(productId);

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove item
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// ============================================
// CLEAR ENTIRE CART
// ============================================
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// ============================================
// GET CART SUMMARY (Totals only)
// ============================================
export const getCartSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.isEmpty) {
      return res.status(200).json({
        success: true,
        summary: {
          subtotal: 0,
          totalSavings: 0,
          deliveryCharge: 0,
          tax: 0,
          grandTotal: 0,
          itemCount: 0,
          freeDeliveryEligible: false
        }
      });
    }

    const summary = cart.getCartSummary();

    res.status(200).json({
      success: true,
      summary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cart summary',
      error: error.message
    });
  }
};

// ============================================
// UPDATE MULTIPLE ITEMS AT ONCE
// ============================================
export const updateMultipleItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { updates } = req.body; // Array of {productId, quantity}

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates must be a non-empty array'
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Update each item
    updates.forEach(update => {
      const item = cart.getItem(update.productId);
      if (item && update.quantity >= 1) {
        item.quantity = update.quantity;
      }
    });

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart items updated successfully',
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart items',
      error: error.message
    });
  }
};

// ============================================
// MERGE GUEST CART WITH USER CART (After Login)
// ============================================
export const mergeGuestCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guestCartItems } = req.body; // Items from localStorage

    if (!Array.isArray(guestCartItems)) {
      return res.status(400).json({
        success: false,
        message: 'Guest cart items must be an array'
      });
    }

    const cart = await Cart.findOrCreate(userId);

    // Merge items
    guestCartItems.forEach(guestItem => {
      const existingItem = cart.getItem(guestItem.productId);

      if (existingItem) {
        // Increase quantity if item exists
        existingItem.quantity += guestItem.quantity;
      } else {
        // Add new item
        cart.items.push(guestItem);
      }
    });

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Guest cart merged successfully',
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to merge guest cart',
      error: error.message
    });
  }
};

// ============================================
// CHECK STOCK AVAILABILITY
// ============================================
export const checkStockAvailability = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.isEmpty) {
      return res.status(200).json({
        success: true,
        allInStock: true,
        outOfStockItems: []
      });
    }

    const outOfStockItems = [];

    // Check each item's stock
    cart.items.forEach(item => {
      if (item.productId && !item.productId.inStock) {
        outOfStockItems.push({
          productId: item.productId._id,
          name: item.name
        });
        item.inStock = false;
      }
    });

    if (outOfStockItems.length > 0) {
      await cart.save();
    }

    res.status(200).json({
      success: true,
      allInStock: outOfStockItems.length === 0,
      outOfStockItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check stock availability',
      error: error.message
    });
  }
};

// ============================================
// APPLY COUPON/DISCOUNT (Optional)
// ============================================
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { couponCode } = req.body;

    // TODO: Implement coupon validation logic
    // For now, just a placeholder

    res.status(200).json({
      success: true,
      message: 'Coupon feature coming soon'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message
    });
  }
};

// ============================================
// GET CART ITEM COUNT (for header badge)
// ============================================
export const getCartItemCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    const itemCount = cart ? cart.itemCount : 0;

    res.status(200).json({
      success: true,
      itemCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cart item count',
      error: error.message
    });
  }
};

// ============================================
// VALIDATE CART BEFORE CHECKOUT
// ============================================
export const validateCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.isEmpty) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const issues = [];

    // Check each item
    cart.items.forEach(item => {
      // Check if product still exists
      if (!item.productId) {
        issues.push({
          productId: item.productId,
          name: item.name,
          issue: 'Product no longer available'
        });
      }
      // Check stock
      else if (!item.productId.inStock) {
        issues.push({
          productId: item.productId._id,
          name: item.name,
          issue: 'Out of stock'
        });
      }
      // Check price changes
      else if (item.price !== item.productId.price) {
        issues.push({
          productId: item.productId._id,
          name: item.name,
          issue: 'Price has changed',
          oldPrice: item.price,
          newPrice: item.productId.price
        });
      }
    });

    if (issues.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart validation failed',
        issues
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart is valid',
      cart,
      summary: cart.getCartSummary()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to validate cart',
      error: error.message
    });
  }
};