import fs from 'fs/promises';

let io; // Definir la variable sin inicializar

async function loadIO() {
    if (!io) {
        const { io: importedIo } = await import('../app.js');
        io = importedIo;
    }
}

class ProductManager {
    constructor() {
        this.path = './src/data/products.json';
        loadIO(); // Cargar io dinámicamente para evitar dependencias circulares
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));

        if (io) io.emit('updateProducts', products);

        return product;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(id));
        await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));

        if (io) io.emit('updateProducts', filteredProducts);
    }
}

export default ProductManager;
