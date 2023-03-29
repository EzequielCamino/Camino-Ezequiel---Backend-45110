const mongoose = require("mongoose");

const cartsColletion = "carts";
const cartProductSchema = new mongoose.Schema({
    products: {
        product: {type: String},
        quantity: {type: Number}
    }
})

const cartsSchema = new mongoose.Schema({
    products: [cartProductSchema]
});

const cartsModel = mongoose.model(cartsColletion, cartsSchema);

module.exports = cartsModel;