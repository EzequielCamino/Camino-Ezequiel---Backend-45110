const nodemailer = require('nodemailer');
const config = require('../config/config.js')

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user:'ezeeqii@gmail.com',
        pass: config.NODEMAILER_PASSWORD
    }
})

function sendMail(amount, purchaser) {
    transport.sendMail({
        from: 'E-commerce <ezeeqii@gmail.com>',
        to: purchaser,
        subject: 'Order placed',
        html:`
        <div>
          <h1>¡Thank you for your order!</h1>
          <p> Your order total is ${amount} </p>
        </div>
        `
    })
} 

module.exports = { transport, sendMail };