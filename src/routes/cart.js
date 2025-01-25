import { Router } from "express";
import CartManager from "../manegers/cartManager.js";

const router = Router();

const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

router.post('/', async (req,res) => {
    const result = await cartManager.createCart();
    res.status('201').send(result);
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(Number(cid));
    res.send(cart)
})

router.post ('/:cid/product/:pid', async (req, res) => {
    const { cid, pid} = req.params;
    await cartManager.addProductToCart(Number(cid), Number(pid));
    res.status(200).send('Producto añadido');
})

export default router;