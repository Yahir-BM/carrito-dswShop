const { Router } = require('express');
const router = Router();

// Importamos los métodos del controlador
const { 
    getAll, 
    getById, 
} = require('../controllers/products.controller');

// Definimos las rutas y las asociamos a los controladores

// GET /api/products
router.get('/', getAll);

// GET /api/products/:id
router.get('/:id', getById);


// (Aquí puedes añadir PUT para actualizar, DELETE para borrar, etc.)

// Exportamos el router
module.exports = router;