const mongoose = require("mongoose");
const productsCollection = "products";
const mongoosePaginate = require('mongoose-paginate-v2');

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    stock:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    owner:{
        type: String,
        default: "admin"
    },
    thumbnails:{type: Array}
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = productsModel;