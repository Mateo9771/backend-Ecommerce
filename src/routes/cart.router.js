//routes/cart.js
import { Router } from "express";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const router = Router();

// Obtener y renderizar el carrito
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product'); // Popula los productos

        if (!cart) {
            return res.render("error", { error: "Carrito no encontrado" });
        }

        res.render("cart", { cart: cart.toObject() }); // Renderiza la vista con los datos del carrito
    } catch (error) {
        res.render("error", { error: "Error al obtener el carrito" });
    }
});

// Agregar productos al carrito y descontar stock
router.post("/add/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const { quantity } = req.body;
        const cartId = "ID_DEL_CARRITO"; // Reemplazar por ID real del carrito (sesión o usuario)

        // Verificar si el producto existe
        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.render("error", { error: "Producto no encontrado" });
        }

        // Verificar stock disponible
        if (product.stock < quantity) {
            return res.render("error", { error: "Stock insuficiente" });
        }

        // Buscar o crear el carrito
        let cart = await CartModel.findById(cartId);
        if (!cart) {
            cart = new CartModel({ _id: cartId, products: [] });
        }

        // Buscar si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += parseInt(quantity);
        } else {
            cart.products.push({ product: pid, quantity: parseInt(quantity) });
        }

        // Descontar stock
        await ProductModel.findByIdAndUpdate(pid, { $inc: { stock: -quantity } });

        await cart.save();
        res.redirect(`/cart/${cartId}`); // Redirigir a la vista del carrito
    } catch (error) {
        res.render("error", { error: "Error al agregar producto al carrito" });
    }
});

// Eliminar producto del carrito
router.post('/:cid/products/:pid/delete', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.render("error", { error: "Carrito no encontrado" });
        }

        // Obtener el producto para restaurar el stock
        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) {
            return res.render("error", { error: "Producto no encontrado en el carrito" });
        }

        // Restaurar el stock
        await ProductModel.findByIdAndUpdate(pid, { $inc: { stock: productInCart.quantity } });

        // Filtrar el producto eliminado
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.redirect(`/cart/${cid}`);
    } catch (error) {
        res.render("error", { error: "Error al eliminar producto del carrito" });
    }
});

//  Actualizar carrito con stock validado
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; // Lista de productos con cantidad

        let cart = await CartModel.findById(cid);
        if (!cart) {
            return res.render("error", { error: "Carrito no encontrado" });
        }

        for (const newProduct of products) {
            const product = await ProductModel.findById(newProduct.product);
            if (!product || product.stock < newProduct.quantity) {
                return res.render("error", { error: `Stock insuficiente para ${newProduct.product}` });
            }
        }

        // Descontar stock y actualizar el carrito
        for (const newProduct of products) {
            await ProductModel.findByIdAndUpdate(newProduct.product, { 
                $inc: { stock: -newProduct.quantity }
            });
        }

        cart.products = products;
        await cart.save();

        res.redirect(`/cart/${cid}`);
    } catch (error) {
        res.render("error", { error: "Error al actualizar el carrito y descontar stock" });
    }
});

export default router;