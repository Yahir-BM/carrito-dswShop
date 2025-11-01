const db = require("./firebase");
const {randomUUID} = require("node:crypto");
const FacturapiModule = require('facturapi');
// Intenta acceder al constructor a través de a propiedad 'default'
const Facturapi = FacturapiModule.default || FacturapiModule; 
const FACTURAPI_KEY = "sk_test_KRbZrQv3J0p4LwOzOEnq6jdsPvP5mExqVo8O2Anl6M"; 
const facturapi = new Facturapi(FACTURAPI_KEY);

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
         const {description,price,product_key,unit_key} = data;
        if(!description || !price || !product_key || !unit_key){
            throw new error("Falta rellenar los campos obligatorios")
        }
        const id_factura = await createProductFacturapi(data);
        const newProduct ={
            "id_user" : randomUUID(),
            "id_facturapi" : id_factura,
            "productname": data.description,
            "price" : data.price,
            "stock" : data.stock || null,
            "brand" : data.brand || null,
            "category" : data.category || null,
            "code_sat" : data.product_key,
            "url_img" : data.url_img || null
        };
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
        await facturapi.products.save(
    [doc.id_facturapi],
    {
        // Solo incluye los campos que deseas actualizar
        "description": newData.description, 
        "price": newData.price
    }
);
        // Actualiza el documento con los nuevos datos
        await productRef.update(newData);
        return productRef;
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        }
};

async function deleteProduct(id) {
    try {
        const docRef = usersCollection.doc(id);
        const doc = await docRef.get();
    const resultado = await facturapi.products.del(doc.id_facturapi);

    if (resultado === true) {
        console.log(`Producto con ID ${productoId} eliminado exitosamente.`);
    }

        
        if(!doc.exists) return null;
        await docRef.delete();
        return true;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
}


//FACTURAPI
async function createProductFacturapi(productData) {
    try {
        console.log(`Creando producto: ${productData.description}`);
        
        // Llamada a Facturapi para crear el producto
        const productoCreado = await facturapi.products.create({
            description: productData.description,
            product_key: productData.product_key, // Clave SAT Producto/Servicio
            unit_key: productData.unit_key,       // Clave SAT Unidad de Medida
            price: productData.price,
            //El iva esta por default en 16%
        });

        const facturapiProductId = productoCreado.id;
        console.log(`Producto Facturapi creado. ID: ${facturapiProductId}`);
        
        return facturapiProductId;

    } catch (error) {
        console.error('Error al crear el producto:', error.message);
        throw new Error(`Fallo al crear producto en Facturapi: ${error.message}`);
    }
}

module.exports = {
    getAll, getById,updateProduct,createProduct,deleteProduct
};