import express from 'express'
import productsRouter from '../src/routes/products.js'
import cartRouter from '../src/routes/cart.js'

const app = express();

app.get('/', (req, res) => {
    res.send('Servidor activo, bienvenido. Rutas: /api/products o /api/carts');
});
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

const PORT = 8000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))