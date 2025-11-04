import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
  syncCart,
  validateCart
} from '../controllers/orderCart.controller.js';

const router = express.Router();

router.get('/', getCart);
router.get('/count', getCartCount);
router.post('/sync', syncCart);
router.post('/validate', validateCart);
router.post('/add', addToCart);
router.put('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

export default router;