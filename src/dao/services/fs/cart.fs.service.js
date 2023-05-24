const fs = require('fs');

class CartFsService {
    static idCreator = 1;
    carts;
    constructor(path) {
        this.path = path;
    }
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
    async getAll() {
        await this.loadFile();
        return this.carts;
    }
    async create(){
        await this.loadFile();
        const newid = CartManager.idCreator++;
        const newCart = {'id': newid, 'products': []};
        this.carts.push(newCart);
        await this.saveFile();
        return newCart
    }
    async findById(id){
        const selectedCart = this.carts.find((cart)=> cart.id === id);
        return selectedCart
    }
    async findByIdAndUpdate(cid, pid) {
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

module.exports = CartFsService;