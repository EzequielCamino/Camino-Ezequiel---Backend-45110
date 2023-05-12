const jwt = require('jsonwebtoken');
const { JWT_TOKEN } = require("../../data.js");

function generateToken(user){
    return jwt.sign(user, JWT_TOKEN, {
        expiresIn: '24h'
    })
}

function verifyToken(token){
    return jwt.verify(token, JWT_TOKEN);
}

module.exports = {generateToken, verifyToken};