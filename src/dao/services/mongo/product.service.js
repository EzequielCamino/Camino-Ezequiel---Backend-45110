const MongoService = require("./mongo.service.js");
const productModel = require("./models/product.model.js");

class ProductService {
    #persistence;
    constructor(persistence){
        this.#persistence = persistence;
    }
    async getAll() {
        return this.#persistence.getAll();
    }
    async create(product) {
        return this.#persistence.create(product);
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
const instance = new ProductService(new MongoService(productModel));

module.exports = instance;