const mongoose = require('mongoose');
const usersCollection = "users";

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: 
            {
                cart:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "carts",
                }
            },
        default: {}
    },
    role: {
        type: String,
        default: "user"
    }
});

const usersModel = mongoose.model(usersCollection, usersSchema);

module.exports = usersModel;