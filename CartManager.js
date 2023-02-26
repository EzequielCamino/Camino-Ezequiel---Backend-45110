/* const fs = require('fs');
const express = require("express");

class CartManager {
    static idCreator = 0;
    products;
    constructor(path) {
        this.path = path;
        (async ()=> {try {
            const file = await this.loadFile();
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
} */