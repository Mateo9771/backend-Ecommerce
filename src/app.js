// src/app.js
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/viewRouter.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/cart.js';
import { Server } from 'socket.io';

const app = express();
const port = 8000;

// Resolviendo __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Handlebars
app.engine('handlebars', engine());  // Usamos express-handlebars para el motor
app.set('views', path.join(__dirname, 'views')); // Establecemos la carpeta de vistas
app.set('view engine', 'handlebars'); // Decimos que Handlebars es el motor

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index', { title: 'Productos' });
});


// Socket.io
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const io = new Server(server);
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
