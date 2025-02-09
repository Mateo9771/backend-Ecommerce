// src/routes/viewRouter.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Renderizar vista de productos
router.get('/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(path.resolve('./data/products.json'), 'utf-8'));
    res.render('products', {products});
});

// Renderizar vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;