// src/routes/productsRouter.js
 //product.router.js
 import { Router } from "express";
 import ProductModel from "../models/product.model.js";
 
 const router = Router();
 
 //create
 
 router.post('/', async (req,res) => {
     try{
         const newProduct = new ProductModel(req.body);
         console.log("Info del body: ", req.body);
         await newProduct.save();
 
         res.render('product', { product: newProduct.toObject()})        
     }catch(error){
         return res.render('Error', {error: "Error al insertar el producto"})
     }
 })
 
 //read
 router.get('/', async (req,res) => {
    try {
        const { limit = 5, page = 1, sort, query } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { precio: sort === "asc" ? 1 : -1 } : {},
        };

        const filter = query ? { category: { $regex: new RegExp(query, "i") } } : {};
        const products = await ProductModel.paginate(filter, options);

        res.render("products", {
            products: products.docs.map((product) => product.toObject()),
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
        });
    } catch (error) {
        res.render("error", { error: "Error al obtener los productos" });
    }
 })
 
 //read::id
 router.get('/:id', async (req,res) => {
     try{
         const unProducto = await ProductModel.findById(req.params.id);
 
         if(!unProducto){
             return res.render('error', {error:"Producto no encontrado"})
         }
         
         res.render('product', {product: unProducto.toObject()})
     }catch(error){
         return res.render('error', {error:"Error al obtener el producto solicitado"})
     }
 })
 
 //delete
 router.delete('/:id', async (req,res) => {
     try{
         const productoAEliminar = await ProductModel.findByIdAndDelete(req.params.id)
         if(!productoAEliminar){
             return res.render('error', {error:"No se encontro producto a eliminar"})
         }
 
         res.redirect('/product')
     }catch(error){
         return res.render('error', {error: "Error l eliminar producto"})
     }
 })
 
 export default router
 