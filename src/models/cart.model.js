const db = require('./firebase');

// --- Obtener carrito de un usuario ---
async function getCart(userId) {
  try {
    const cartRef = db.collection('Usuario').doc(userId).collection('cart');
    const snapshot = await cartRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    throw error;
  }
}

// --- Agregar producto al carrito del usuario ---
async function addToCart(userId, product) {
  try {
    const cartRef = db.collection('Usuario').doc(userId).collection('cart');
    const docRef = await cartRef.add({
      ...product,
      added_at: new Date().toISOString()
    });
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    throw error;
  }
}

// --- Eliminar producto específico ---
async function removeFromCart(userId, productId) {
  try {
    const cartRef = db.collection('Usuario').doc(userId).collection('cart').doc(productId);
    await cartRef.delete();
    return true;
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    throw error;
  }
}

// --- Vaciar todo el carrito del usuario ---
async function clearCart(userId) {
  try {
    const cartRef = db.collection('Usuario').doc(userId).collection('cart');
    const snapshot = await cartRef.get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    throw error;
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
