const MongoManager = require("./mongo.manager.js");
const usersModel = require("./models/user.model.js");

class UsersManager {
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
const instance = new UsersManager(new MongoManager(usersModel));

module.exports = instance;