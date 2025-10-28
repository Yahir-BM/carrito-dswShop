const Product = require('../models/products.model.js');

async function getAll(req, res) {
   const data = await Product.getAll();
   console.log(req);
   res.status(200).json(data);
};

async function getById(req, res) {
   const user = await Product.getById(req.params.id); //path params
   return user ? res.status(200).json(user) : res.status(404).json({ message: "Producto no encontrado" });
};

const createProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        docref = Product.createProduct(newProduct)
        res.status(201).json({ id: docRef.id, ...newProduct });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const newData = req.body;
        const doc = Product.updateProduct(productId,newData);
        
        if (!doc.exists()) {
            return res.status(404).send("Producto no encontrado para actualizar");
        }

        // Actualiza el documento con los nuevos datos
        
        res.status(201).send("Producto actualizado exitosamente");
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).send("Error interno del servidor");
    }
};



module.exports = {
    getAll,getById, createProduct, updateProduct
};