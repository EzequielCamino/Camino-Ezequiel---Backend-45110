const MongoManager = require("./mongo.manager.js");
const cartModel = require("./models/cart.model.js");

class CartManager {
    #persistence;
    constructor(persistence){
        this.#persistence = persistence;
    }
    async getAll() {
        return this.#persistence.getAll();
    }
    async create() {
        return this.#persistence.create();
    }
    async findById(id){
        return this.#persistence.findById(id);
    }
    async findByIdAndUpdate(id, data){
        return this.#persistence.findByIdAndUpdate(id,data);
    }
    async addProductToCart(cid, pid) {
        const selectedCart = await this.#persistence.findById(cid);
        if(!selectedCart){
            return null
        }
        const productToAdd = selectedCart.products.find((prod)=> prod.product === pid)
        if(!productToAdd){
            const newProduct = {'product': pid, 'quantity': 1};
            selectedCart.products.push(newProduct);
            return this.#persistence.findByIdAndUpdate(cid,selectedCart);
        }
        productToAdd.quantity++
        selectedCart.products.push(productToAdd);
        selectedCart.products.splice(0, 1);
        return this.#persistence.findByIdAndUpdate(cid,selectedCart);
    }
}
const instance = new CartManager(new MongoManager(cartModel));

module.exports = instance;