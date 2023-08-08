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

function sendPurchaseMail(amount, purchaser) {
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

function sendRecoverMail(email, token){
    transport.sendMail({
        from: 'E-commerce <ezeeqii@gmail.com>',
        to: email,
        subject: 'Password recovery',
        html:`
        <div>
          <h1>Here is your link to recover your password</h1>
          <p> ${config.SITE_URL}/api/sessions/recover/${token} </p>
        </div>
        `
    })
}

function sendDeletedUserMail(email, name, lastname){
    transport.sendMail({
        from: 'E-commerce <ezeeqii@gmail.com>',
        to: email,
        subject: 'User eliminated due to inactivity',
        html:`
        <div>
          <h1>Dear ${name} ${lastname},</h1>
          <p>Your user has been eliminated from our website due to inactivity.</p>
          <p>Please remember that maximum inactive time is 48hs</p>
        </div>
        `
    })
}

function sendEliminatedProductMail(email, pid) {
    transport.sendMail({
        from: 'E-commerce <ezeeqii@gmail.com>',
        to: email,
        subject: 'Products eliminated',
        html:`
        <div>
          <h1>Dear customer,</h1>
          <p>Your product with id ${pid} has been eliminated</p>
        </div>
        `
    })
}

module.exports = { transport, sendPurchaseMail, sendRecoverMail, sendDeletedUserMail, sendEliminatedProductMail };