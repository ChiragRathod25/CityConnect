import { Cart } from '../models/orderCart.model.js';
import { BusinessProduct } from '../models/businessProduct.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.getCartWithProducts(userId);

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(200, {
        items: [],
        subtotal: 0,
        deliveryCharge: 0,
        tax: 0,
        grandTotal: 0,
        itemCount: 0,
        isEmpty: true
      }, 'Cart is empty')
    );
  }

  const summary = await cart.getCartSummary();

  return res.status(200).json(
    new ApiResponse(200,  'Cart retrieved successfully', summary)
  );
});

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new ApiError(400, 'Product ID is required');
  }

  if (quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  const product = await BusinessProduct.findById(productId);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const cart = await Cart.findOrCreate(userId);
  const existingItem = cart.getItem(productId);
  const requestedQuantity = existingItem ? existingItem.quantity + quantity : quantity;

  if (requestedQuantity > product.stock) {
    throw new ApiError(
      400, 
      `Only ${product.stock} items available in stock`,
      { availableStock: product.stock }
    );
  }

  await cart.addItem(productId, quantity);

  const updatedCart = await Cart.getCartWithProducts(userId);
  const summary = await updatedCart.getCartSummary();

  console.log("Cart after addition:", summary);

  return res.status(200).json(
    new ApiResponse(200,"Item added to cart successfully", summary)
  );
});

const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 0) {
    throw new ApiError(400, 'Valid quantity is required');
  }

  const cart = await Cart.findOrCreate(userId);

  if (!cart.hasProduct(productId)) {
    throw new ApiError(404, 'Item not found in cart');
  }

  if (quantity > 0) {
    const product = await BusinessProduct.findById(productId);
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (quantity > product.stock) {
      throw new ApiError(
        400,
        `Only ${product.stock} items available in stock`,
        { availableStock: product.stock }
      );
    }
  }

  await cart.updateQuantity(productId, quantity);

  const updatedCart = await Cart.getCartWithProducts(userId);
  const summary = await updatedCart.getCartSummary();

  return res.status(200).json(
    new ApiResponse(
      200, 
      quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
      summary
    )
  );
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOrCreate(userId);

  if (!cart.hasProduct(productId)) {
    throw new ApiError(404, 'Item not found in cart');
  }

  await cart.removeItem(productId);

  const updatedCart = await Cart.getCartWithProducts(userId);
  const summary = await updatedCart.getCartSummary();

  return res.status(200).json(
    new ApiResponse(200, summary, 'Item removed from cart successfully')
  );
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOrCreate(userId);
  await cart.clearCart();

  return res.status(200).json(
    new ApiResponse(200, {
      items: [],
      subtotal: 0,
      deliveryCharge: 0,
      tax: 0,
      grandTotal: 0,
      itemCount: 0,
      isEmpty: true
    }, 'Cart cleared successfully')
  );
});

const getCartCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(200, { count: 0 })
    );
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return res.status(200).json(
    new ApiResponse(200, { count: itemCount })
  );
});

const syncCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.getCartWithProducts(userId);

  if (!cart || cart.items.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, {
        items: [],
        removedItems: [],
        updatedItems: []
      }, 'Cart is empty')
    );
  }

  const removedItems = [];
  const updatedItems = [];

  for (let i = cart.items.length - 1; i >= 0; i--) {
    const item = cart.items[i];
    const product = item.productId;

    if (!product) {
      removedItems.push({
        productId: item.productId,
        reason: 'Product no longer available'
      });
      cart.items.splice(i, 1);
      continue;
    }

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

  return res.status(200).json(
    new ApiResponse(200, {
      ...summary,
      removedItems,
      updatedItems
    }, 'Cart synced successfully')
  );
});

const validateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.getCartWithProducts(userId);

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  const issues = [];

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
    throw new ApiError(400, 'Cart has issues that need to be resolved', { issues });
  }

  const summary = await cart.getCartSummary();

  return res.status(200).json(
    new ApiResponse(200, summary, 'Cart is valid and ready for checkout')
  );
});

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
  syncCart,
  validateCart
}