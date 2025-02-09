import fs from 'fs/promises'

class CartManager {
    constructor(){
        this.path = './src/data/carts.json'
    }

    async getCarts(){
        const data = await fs.readFile(this.paht, 'utf-8');
        return JSON.parse(data)
    }

    async getCartById(id){
        const carts = await this.getCarts();
        return carts.find(c => c.id === id)
    }

    async createCart(){
        const carts = await this.getCarts();
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart =  carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex(p => p.product === productId);
        if(productIndex !== -1) {
            cart.products[productIndex].quantity++;
        }else{
            cart.products.push({ product: productId, quantity: 1});
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
    }
}

export default CartManager