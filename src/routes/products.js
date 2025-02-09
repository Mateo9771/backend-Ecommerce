// src/routes/productsRouter.js
import express from 'express';
import productManager from '../managers/productManager.js'; // Asegúrate de tener el manager de productos configurado

const router = express.Router();

// Definir las rutas para productos
router.get('/', (req, res) => {
  const products = productManager.getAll();  // O el método que uses para obtener productos
  res.json(products);
});

router.post('/', (req, res) => {
  const { title, price } = req.body;
  const newProduct = productManager.add({ title, price }); // Agregar producto
  res.status(201).json(newProduct);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  productManager.delete(id);  // Lógica para eliminar un producto
  res.status(200).send('Producto eliminado');
});

export default router;
