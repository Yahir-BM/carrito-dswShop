const User = require('../models/users.model');

async function getAll(req, res) {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
}

async function getById(req, res) {
    try {
        const user = await User.getById(req.params.id);
        user
            ? res.status(200).json(user)
            : res.status(404).json({ message: "Usuario no encontrado" });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario" });
    }
}

async function createUser(req, res) {
    try {
        const { id_facturapi, id_user, username, password, rol, email, address } = req.body;

        if (!username || !password || !rol || !email || !address) {
            return res.status(400).json({message: "Faltan campos obligatorios"});
        }

        const newUser = { 
            id_facturapi,
            id_user,
            username, 
            password, 
            rol, 
            email, 
            address
        };

        const created = await User.createUser(newUser);
        res.status(201).json(created);

    } catch (error) {
        console.error("Error al crear usuario", error);
        res.status(500).json({message: "Error al crear usuario"});
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const updated = await User.updateUser(id, req.body);

        updated
            ? res.status(200).json({ message: "Usuario actualizado correctamente" })
            : res.status(404).json({ message: "Usuario no encontrado" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario" });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const deleted = await User.deleteUser(id);

        deleted
            ? res.status(200).json({ message: "Usuario eliminado correctamente" })
            : res.status(404).json({ message: "Usuario no encontrado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario" });
    }
}

module.exports = {
    getAll,
    getById,
    createUser,
    updateUser,
    deleteUser
};
