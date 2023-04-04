const mongoose = require("mongoose");
const cartsColletion = "carts";

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: {type: Number}
            }
        ],
        default: []
    }
});

const cartsModel = mongoose.model(cartsColletion, cartsSchema);

module.exports = cartsModel;