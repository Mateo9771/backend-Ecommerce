import { Router } from "express";
import ProductManager from "../manegers/productManager.js";

const router = Router();

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.post('/', async (req,res) => {
    const product = req.body;
    const result = await productManager.addProduct(product);
    res.status(201).send(result)
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updates = req.body;
    const result = await productManager.updateProduct(Number(pid), updates);
    res.send(result)
});

router.delete('/:pid', async (req, res) => { 
    const {pid} = req.params;
    await productManager.deleteProduct(Number(pid))
    res.status(204).send()
});

export default router;