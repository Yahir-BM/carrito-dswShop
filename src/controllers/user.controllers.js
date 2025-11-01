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

        //Validaciones de username
        if (username.length < 4 || username.length > 20) {
            return res.status(400).json({message: "El nombre del usuario debe ser de 4 a 20 caracteres"})
        }

        //Validaciones de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "El correo electrónico no tiene un formato válido" });
        }

        //Validaciones de rol
        const rolesPermitidos = ["admin", "cliente", "vendedor"];
        if (!rolesPermitidos.includes(rol.toLowerCase())) {
            return res.status(400).json({ message: `Rol no válido. Los roles permitidos son: ${rolesPermitidos.join(", ")}` });
        }

        //Validaciones de direcciones
        if (address.length < 10) {
            return res.status(400).json({ message: "La dirección debe tener al menos 10 caracteres"})

        }

        const newUser = { 
            id_facturapi: id_facturapi || null,
            id_user: id_user || null,
            username, 
            password, 
            rol: rol.toLowerCase(), 
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
        const data = req.body;

        //Si no envía ningún campo para actualizar
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }

        // --- Validaciones condicionales (solo si los campos vienen en el body) ---
        if (data.username) {
            if (data.username.length < 4 || data.username.length > 20) {
                return res.status(400).json({ message: "El nombre de usuario debe tener entre 4 y 20 caracteres" });
            }
        }

        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return res.status(400).json({ message: "El correo electrónico no tiene un formato válido" });
            }
        }

        if (data.rol) {
            const rolesPermitidos = ["admin", "cliente", "vendedor"];
            if (!rolesPermitidos.includes(data.rol.toLowerCase())) {
                return res.status(400).json({ 
                    message: `Rol no válido. Los roles permitidos son: ${rolesPermitidos.join(", ")}`
                });
            }
            data.rol = data.rol.toLowerCase();
        }

        if (data.address) {
            if (data.address.length < 10) {
                return res.status(400).json({ message: "La dirección debe tener al menos 10 caracteres" });
            }
        }

        //Llamada al modelo para actualizar
        const updated = await User.updateUser(id, data);

        if (!updated) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error("Error al actualizar usuario", error);
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
