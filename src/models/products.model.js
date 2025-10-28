const db = require("./firebase");


const productsCollection = db.collection('Product');
async function getAll() {
    try {
        const snapshot = await productsCollection.get();
        // CORRECCIÓN: .data() es una función
        return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    } catch (error) {
        console.log(error);
    }
};

async function getById(id) {
    try {
        const productRef =  productsCollection.doc(id);
        const snapshotProd = await productRef.get();
        
        return snapshotProd.exists ? { id: snapshotProd.id, ...snapshotProd.data() } : null;

    } catch (error) {
        console.log(error);
    }
};

const createProduct = async (data) => {
    try {
        const newProduct = data;
        const docRef = await productsCollection.add(newProduct);
        return docRef;
    } catch (error) {
        console.error("Error al crear producto:", error);
    }
};

const updateProduct = async (id, body) => {
    try {
        const productId = id;
        const newData = body;
        
        const productRef = productsCollection.doc(productId);
        const doc = await productRef.get();

        if (!doc.exists()) {
            return null;
        }

        // Actualiza el documento con los nuevos datos
        await productRef.update(newData);
        return productRef;
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        }
};

// CORRECCIÓN: Usar 'export' en lugar de 'module.exports'
module.exports = {
    getAll, getById,updateProduct,createProduct
};