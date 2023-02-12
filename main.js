const fs = require('fs');

class ProductManager {
    static idCreator = 0;
    products;
    constructor(path) {
        this.path = path;
        (async ()=> {try {
            await this.loadFile();
        } catch {
            throw new Error(error);
        }
    })}
    async loadFile(){
        try {
            const productsLoad = await fs.promises.readFile(this.path);
            return this.products = JSON.parse(productsLoad)
            /* this.products = JSON.parse(fs.readFileSync(this.path, "utf-8")); */
        } catch (error) {
            this.products = [];
            await this.saveFile();
        }
    }
    async saveFile(){
        try {
            const productsSave = JSON.stringify(this.products);
            await fs.promises.writeFile(this.path, productsSave);
            /* fs.writeFileSync(this.path, JSON.stringify(this.products)); */
        } catch (error) {
            throw new Error(error);
        }
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        await this.loadFile()
        if(this.products.find((product) => product.code === code)) {
            return console.log("Code assigned");
        } else if(title && description && price && thumbnail && stock) {
            ProductManager.idCreator++;
            const id = ProductManager.idCreator
            const product = {id, title, description, price, thumbnail, code, stock};
            this.products.push(product);
            await this.saveFile();
        } else {
            return console.warn("Faltan completar datos");
        }
    }
    async getProducts() {
        await this.loadFile();
        console.log(this.products);
    }
    async getProductById(id){
        await this.loadFile();
        return this.products.find((product) => product.id === id) || console.warn("Product ID not found");
        
    }
    async updateProduct(id, data){
        await this.loadFile();
        if(this.products.find((product) => product.id === id)){
            const updatedProduct = this.products.map((product) => product.id === id ? {...product, ...data} : product)
            this.products = updatedProduct;
            return await this.saveFile();
        }
        console.warn("Product not updated. ID not found");
    }
    async deleteProduct(id){
        await this.loadFile();
        const index = this.products.indexOf(this.products.find((product) => product.id === id));
        if(index === -1){
            return console.warn("Product not deleted. ID not found")
        }
        this.products.splice(index, 1);
        console.log(this.products)
        await this.saveFile();
    }
}


/* TESTING CODE */

/* let newProducts = new ProductManager("products.json");
newProducts.getProducts();
newProducts.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
newProducts.addProduct("producto prueba2", "Este es otro producto prueba", 200, "Sin imagen", "abc1234", 25);
newProducts.getProducts();
newProducts.getProductById(5);
newProducts.getProductById(2);
newProducts.updateProduct(5, {title: 'producto prueba updateado'});
newProducts.updateProduct(1, {title: 'producto prueba updateado'});
newProducts.getProducts();
newProducts.deleteProduct(5);
newProducts.deleteProduct(2);
newProducts.getProducts(); */