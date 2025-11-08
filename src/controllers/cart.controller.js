const Cart = require('../models/cart.model');

async function getCart(req, res) {
  try {
    const { userId } = req.params;
    const items = await Cart.getCart(userId);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carrito", error: error.message });
  }
}

async function addToCart(req, res) {
  try {
    const { userId } = req.params;
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const product = { name, price, quantity };
    const added = await Cart.addToCart(userId, product);
    res.status(201).json(added);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto", error: error.message });
  }
}

async function removeFromCart(req, res) {
  try {
    const { userId, productId } = req.params;
    await Cart.removeFromCart(userId, productId);
    res.status(200).json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
}

async function clearCart(req, res) {
  try {
    const { userId } = req.params;
    await Cart.clearCart(userId);
    res.status(200).json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar carrito", error: error.message });
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
