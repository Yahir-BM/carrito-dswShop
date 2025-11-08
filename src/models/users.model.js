const db = require("./firebase");
const { randomUUID } = require("node:crypto");
const FacturapiModule = require("facturapi");
const Facturapi = FacturapiModule.default || FacturapiModule;
const FACTURAPI_KEY = 'sk_test_KRbZrQv3J0p4LwOzOEnq6jdsPvP5mExqVo8O2Anl6M'
const facturapi = new Facturapi(FACTURAPI_KEY);

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

        const {username, password, rol, email, address, tax_id, legal_name } = data;

        if(!username || !password || !rol || !email || !address || !tax_id || !legal_name) {
            throw new Error("Faltan campos por rellenar (Obligatorios)"); 
        }

        //Para crear cliente en facturapi
        //const facturapiCustomerId = await createCustomerFacturapi(data);
        const facturapiCustomerId = "test_id_facturapi"; //Nomas para testear

        const newUser = {
            id_facturapi: facturapiCustomerId,
            id_user: randomUUID(),
            username,
            password,
            rol,
            email,
            address,
            tax_id,
            legal_name,
            created_at: new Date().toISOString()
        };

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

       const userData = doc.data();

       if (userData.id_facturapi) {
        await updateCustomerFacturapi(userData.id_facturapi,data);
       }

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

        const userData = doc.data();

        if (userData.id_facturapi) {
            await deleteCustomerFacturapi(userData.id_facturapi);
        }

        await docRef.delete();
        return true;

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
}

//Crear cliente en facturapi
async function createCustomerFacturapi(userData) {
    try {
        console.log('Intentando crear cliente en Facturapi con:', {
            legal_name: userData.legal_name,
            tax_id: userData.tax_id,
            email: userData.email
        });

        const customer = await facturapi.customers.create({
            legal_name: userData.legal_name,
            email: userData.email,
            tax_id: userData.tax_id,
            address: {
                street: userData.address.substring(0, 100), // Máximo 100 caracteres
                exterior: "123", // Necesario
                neighborhood: "Centro", // Necesario  
                city: "Ciudad de México", // Necesario
                zip: "06000", // Necesario
                state: "CDMX", // Necesario
                country: "MX"
            }
        });
        
        console.log('Cliente creado en Facturapi:', customer.id);
        return customer.id;
        
    } catch (error) {
        console.error(" Error DETAILED de Facturapi:", error.response?.data || error.message);
        throw new Error(`No se pudo crear el cliente en Facturapi: ${error.message}`);
    }
}

async function updateCustomerFacturapi(id_facturapi, newData) {
    try {
        await facturapi.customers.update(id_facturapi, {
            legal_name: newData.legal_name,
            email: newData.email,
            tax_id: newData.tax_id,
            address: {
                street: newData.address,
                country: "MX"
            }
        });
    } catch (error) {
        console.error("Error al actualizar cliente en facturapi", error.message);
    }
}

//Eliminar cliente de facturapi
async function deleteCustomerFacturapi(id_facturapi) {
    try {
        await facturapi.customers.del(id_facturapi);
    } catch (error) {
        console.error("Error al eliminar cliente en Facturapi:", error.message);
    }
}

module.exports = {
    getAll,
    getById,
    createUser,
    updateUser,
    deleteUser
}