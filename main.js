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
        } catch (error) {
            this.products = [];
            await this.saveFile();
        }
    }
    async saveFile(){
        try {
            const productsSave = JSON.stringify(this.products);
            await fs.promises.writeFile(this.path, productsSave);
        } catch (error) {
            throw new Error(error);
        }
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        await this.loadFile()
        if(this.products.find((product) => product.code === code)) {
            return console.log("Code assigned");
        } else if(title && description && price && thumbnail && stock) {
            await ProductManager.idCreator++;
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


/************* TESTING CODE *************/

/* async function main(){
    const newProducts = new ProductManager("products.json");
    await newProducts.getProducts();
    await newProducts.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
    await newProducts.addProduct("producto prueba2", "Este es otro producto prueba", 200, "Sin imagen", "abc1234", 25);
    await newProducts.getProducts();
    await newProducts.getProductById(5);
    await newProducts.getProductById(2);
    await newProducts.updateProduct(5, {title: 'producto prueba updateado'});
    await newProducts.updateProduct(1, {title: 'producto prueba updateado'});
    await newProducts.getProducts();
    await newProducts.deleteProduct(5);
    await newProducts.deleteProduct(2);
    await newProducts.getProducts();
}

main(); */