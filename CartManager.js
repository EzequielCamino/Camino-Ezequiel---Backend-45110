const fs = require('fs');
const express = require("express");

class CartManager {
    static idCreator = 1;
    carts;
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
            const cartsLoad = await fs.promises.readFile(this.path);
            return this.carts = JSON.parse(cartsLoad)
        } catch (error) {
            this.carts = [];
            await this.saveFile();
        }
    }
    async saveFile(){
        try {
            const cartsSave = JSON.stringify(this.carts);
            await fs.promises.writeFile(this.path, cartsSave);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getCarts() {
        await this.loadFile();
        return this.carts;
    }
    async addCart(){
        await this.loadFile();
        const newid = CartManager.idCreator++;
        const newCart = {'id': newid, 'products': []};
        this.carts.push(newCart);
        await this.saveFile();
        return newCart
    }
    async addProductToCart(cid, pid) {
        await this.loadFile();
        const selectedCart = this.carts.find((cart)=> cart.id === cid);
        if(!selectedCart){
            return null
        }
        const productToAdd = selectedCart.products.find((prod)=> prod.product === pid)
        if(!productToAdd){
            const newProduct = {'product': pid, 'quantity': 1};
            selectedCart.products.push(newProduct);
            await this.saveFile();
            return newProduct
        }
        const cartIndex = this.carts.indexOf(selectedCart);
        const productIndex = selectedCart.products.indexOf(productToAdd);
        this.carts[cartIndex].products[productIndex].quantity++
        await this.saveFile();
        return true
    }
}

module.exports = CartManager;