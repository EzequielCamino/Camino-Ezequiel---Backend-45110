const fs = require('fs');
const express = require("express");

class ProductManager {
    static idCreator = 0;
    products;
    constructor(path) {
        this.path = path;
    }
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
    async addProduct(product) {
        await this.loadFile()
        if(this.products.find((prod) => prod.code === product.code)) {
            console.log("Code assigned");
            return null
        }
        ProductManager.idCreator++;
        const id = ProductManager.idCreator
        const finalProduct = {id, ...product};
        this.products.push(finalProduct);
        await this.saveFile();
        return id;
    }
    async getProducts() {
        await this.loadFile();
        return this.products;
    }
    async getProductById(id){
        await this.loadFile();
        return this.products.find((product) => product.id === id);
        
    }
    async updateProduct(id, data){
        await this.loadFile();
        if(this.products.find((product) => product.id === id)){
            const updatedProduct = this.products.map((product) => product.id == id ? {...product, ...data} : product)
            this.products = updatedProduct;
            await this.saveFile();
            return id
        }
        return null
        console.warn("Product not updated. ID not found");
    }
    async deleteProduct(id){
        await this.loadFile();
        const productFind = await this.products.find((product) => product.id === id)
        const index = await this.products.indexOf(productFind);
        if(index === -1){
            console.warn("Product not deleted. ID not found")
            return null
        }
        this.products.splice(index, 1);
        await this.saveFile();
        return id
    }
}

module.exports = ProductManager;


/************* TESTING CODE *************/

/* async function main(){
const newProducts = new ProductManager("products.json");
await newProducts.getProducts();
await newProducts.addProduct("producto prueba", "Este es un producto prueba", 100, "Sin imagen", "abc123", 22);
await newProducts.addProduct("producto prueba2", "Este es otro producto prueba", 200, "Sin imagen", "abc1234", 23);
await newProducts.addProduct("producto prueba3", "Este es otro producto prueba", 300, "Sin imagen", "abc12345", 2);
await newProducts.addProduct("producto prueba4", "Este es otro producto prueba", 400, "Sin imagen", "abc123456", 5);
await newProducts.addProduct("producto prueba5", "Este es otro producto prueba", 500, "Sin imagen", "abc4321", 15);
await newProducts.addProduct("producto prueba6", "Este es otro producto prueba", 600, "Sin imagen", "abc432", 45);
await newProducts.addProduct("producto prueba7", "Este es otro producto prueba", 700, "Sin imagen", "abc42314", 65);
await newProducts.addProduct("producto prueba8", "Este es otro producto prueba", 800, "Sin imagen", "abc654", 20);
await newProducts.addProduct("producto prueba9", "Este es otro producto prueba", 900, "Sin imagen", "abc65487", 25);
await newProducts.addProduct("producto prueba10", "Este es otro producto prueba", 1000, "Sin imagen", "abc16878", 40);
await newProducts.updateProduct(2, {title: 'producto prueba updateado'});
await newProducts.getProducts();
}
main(); */