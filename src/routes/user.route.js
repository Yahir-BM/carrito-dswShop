const { Router } = require('express');
const router = Router();

const {
    getAll,
    getById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users.controller');

// Rutas CRUD de usuarios
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
