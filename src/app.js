//app.js
import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import exphbs from "express-handlebars";

//importo los routers
import viewsRouter from './routes/views.router.js'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'

 //Configuración dotenv
 import dotenv from 'dotenv';
 dotenv.config();
 const PORT = process.env.PORT;
 const URIMongoDB = process.env.URL_MONGODB


//constante para utilizar express
const app = express()

//configuración de json
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Motor de plantilla
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//set public
app.use(express.static(__dirname + '/public'))

//conexiones
const server = app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})
mongoose.connect(URIMongoDB)
    .then( ()=> console.log("Conexion realizada con exito"))
    .catch((error) => console.error("Error al conectar con la base de datos". error))

//reescribier e inetrpretar el valor  del campo _method de un formulario
app.use(methodOverride("_method"))

//implemento los routers
app.use('/', viewsRouter) //VISTAS res.render()
app.use('/product', productRouter) //Operaciones CRUD renderizadas
app.use('/cart', cartRouter)