const jwt = require('jsonwebtoken');
const config = require("../config/config.js")

function generateToken(user){
    return jwt.sign(user, config.JWT_TOKEN, {
        expiresIn: '24h'
    })
}

function verifyToken(token){
    return jwt.verify(token, config.JWT_TOKEN);
}

module.exports = {generateToken, verifyToken};