const MongoService = require("./mongo.service.js");
const cartModel = require("../models/cart.model.js");

class CartService {
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
    async findByIdAndDelete(id){
        return this.#persistence.findByIdAndDelete(id);
    }
}
const instance = new CartService(new MongoService(cartModel));

module.exports = instance;