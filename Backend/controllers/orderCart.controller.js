import { Cart } from '../models/orderCart.model.js';
import { BusinessProduct } from '../models/businessProduct.model.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.getCartWithProducts(userId);

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        data: {
          items: [],
          subtotal: 0,
          deliveryCharge: 0,
          tax: 0,
          grandTotal: 0,
          itemCount: 0,
          isEmpty: true
        }
      });
    }

    const summary = await cart.getCartSummary();

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: summary
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart',
      error: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists
    const product = await BusinessProduct.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock availability
    const cart = await Cart.findOrCreate(userId);
    const existingItem = cart.getItem(productId);
    const requestedQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (requestedQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
        availableStock: product.stock
      });
    }

    // Add item to cart
    await cart.addItem(productId, quantity);

    // Get updated cart with summary
    const updatedCart = await Cart.getCartWithProducts(userId);
    const summary = await updatedCart.getCartSummary();

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: summary
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const cart = await Cart.findOrCreate(userId);

    // Check if item exists in cart
    if (!cart.hasProduct(productId)) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // If quantity > 0, check stock
    if (quantity > 0) {
      const product = await BusinessProduct.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
          availableStock: product.stock
        });
      }
    }

    // Update quantity (if 0, it will remove the item)
    await cart.updateQuantity(productId, quantity);

    // Get updated cart
    const updatedCart = await Cart.getCartWithProducts(userId);
    const summary = await updatedCart.getCartSummary();

    res.status(200).json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
      data: summary
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOrCreate(userId);

    // Check if item exists
    if (!cart.hasProduct(productId)) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove item
    await cart.removeItem(productId);

    // Get updated cart
    const updatedCart = await Cart.getCartWithProducts(userId);
    const summary = await updatedCart.getCartSummary();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: summary
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOrCreate(userId);
    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        subtotal: 0,
        deliveryCharge: 0,
        tax: 0,
        grandTotal: 0,
        itemCount: 0,
        isEmpty: true
      }
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

export const getCartCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        count: 0
      });
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      success: true,
      count: itemCount
    });

  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart count',
      error: error.message
    });
  }
};

export const syncCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.getCartWithProducts(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        data: {
          items: [],
          removedItems: [],
          updatedItems: []
        }
      });
    }

    const removedItems = [];
    const updatedItems = [];

    // Check each item
    for (let i = cart.items.length - 1; i >= 0; i--) {
      const item = cart.items[i];
      const product = item.productId;

      // If product doesn't exist or is deleted
      if (!product) {
        removedItems.push({
          productId: item.productId,
          reason: 'Product no longer available'
        });
        cart.items.splice(i, 1);
        continue;
      }

      // If quantity exceeds stock
      if (item.quantity > product.stock) {
        if (product.stock === 0) {
          removedItems.push({
            productId: product._id,
            name: product.name,
            reason: 'Out of stock'
          });
          cart.items.splice(i, 1);
        } else {
          updatedItems.push({
            productId: product._id,
            name: product.name,
            oldQuantity: item.quantity,
            newQuantity: product.stock,
            reason: 'Quantity adjusted to available stock'
          });
          item.quantity = product.stock;
        }
      }
    }

    await cart.save();

    const summary = await cart.getCartSummary();

    res.status(200).json({
      success: true,
      message: 'Cart synced successfully',
      data: {
        ...summary,
        removedItems,
        updatedItems
      }
    });

  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync cart',
      error: error.message
    });
  }
};

export const validateCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.getCartWithProducts(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const issues = [];

    // Check each item
    for (const item of cart.items) {
      const product = item.productId;

      if (!product) {
        issues.push({
          productId: item.productId,
          issue: 'Product no longer available'
        });
        continue;
      }

      if (product.stock === 0) {
        issues.push({
          productId: product._id,
          name: product.name,
          issue: 'Out of stock'
        });
      } else if (item.quantity > product.stock) {
        issues.push({
          productId: product._id,
          name: product.name,
          issue: `Only ${product.stock} items available`,
          availableStock: product.stock
        });
      }
    }

    if (issues.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart has issues that need to be resolved',
        issues
      });
    }

    const summary = await cart.getCartSummary();

    res.status(200).json({
      success: true,
      message: 'Cart is valid and ready for checkout',
      data: summary
    });

  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate cart',
      error: error.message
    });
  }
};