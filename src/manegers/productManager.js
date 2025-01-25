import fs from 'fs/promises'


class ProductManager {
    constructor () {
        this.path = './src/data/products.json';
    }

    async getProducts () {
        const data = await fs.readFile(this.path, 'utf8');
        return JSON.parse(data);
    }

    async getProductById (id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id)
    }

    async addProduct (product) {
        const products = await this.getProducts();
        const newProduct = { id: products.length + 1, ...product};
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct
    }

    async updateProduct (id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');
        products[index] = { ...products[index], ...updates };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index]
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2))
    }
}

export default ProductManager;