const mongoose = require("mongoose");
const ticketColletion = "tickets";
const crypto = require('crypto');
 
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        default: crypto.randomUUID()
    },
    purchase_datetime: {
        type: Date,
        default: new Date()
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const ticketModel = mongoose.model(ticketColletion, ticketSchema);

module.exports = ticketModel;