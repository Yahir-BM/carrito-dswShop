const { Router } = require('express');
const router = Router();

const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');

// Rutas con userId
router.get('/:userId', getCart); // Obtener carrito del usuario
router.post('/:userId', addToCart); // Agregar producto
router.delete('/:userId/:productId', removeFromCart); // Eliminar producto
router.delete('/:userId', clearCart); // Vaciar carrito

module.exports = router;
