const express = require('express');
const cors = require('cors');

// Importamos el router de productos
const productRoutes = require('./routes/products.route');
const userRoutes = require('./routes/user.route');
const cartRoutes = require('./routes/cart.route');

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

// --- Iniciar el servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor API REST corriendo en http://localhost:${PORT}`);
});