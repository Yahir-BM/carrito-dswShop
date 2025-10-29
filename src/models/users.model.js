const db = require("./firebase");

const usersCollection = db.collection('Usuario');

async function getAll() {
    try{
        const snapshot = await usersCollection.get();
        return snapshot.docs.map( doc => ({id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
}

async function getById(id) {
    try{
        const docRef = usersCollection.doc(id);
        const doc = await docRef.get();
        return doc.exists ? {id: doc.id, ...doc.data() } : null; 
    } catch (error) { 
        console.error("Error al obtener usuario:", error);
        throw error
    }    
}

async function createUser(data) { 
    try {

        const { id_facturapi, id_user, username, password, rol, email, address } = data;

        if(!username || !password || !rol || !email || !address) {
            throw new error("Faltana campos por rellenar (Obligatorios)"); 
        }

        const newUser = {
            id_facturapi: id_facturapi || null,
            id_user: id_user || null,
            username,
            password,
            rol,
            email,
            address
        }

        const docRef = await usersCollection.add(newUser);
        return { id: docRef.id, ...newUser};

    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error;
    }
}

async function updateUser(id, data) {
    try {
        const docRef = usersCollection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) return null;
        await docRef.update(data);

        return { id, ...data};
    } catch (error) {
        console.error("Error al atualizar usuario", error);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const docRef = usersCollection.doc(id);
        const doc = await docRef.get();

        if(!doc.exists) return null;
        await docRef.delete();
        return true;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
}

module.exports = {
    getAll,
    getById,
    createUser,
    updateUser,
    deleteUser
}