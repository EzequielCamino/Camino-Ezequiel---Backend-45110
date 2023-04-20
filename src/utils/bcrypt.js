const bcrypt = require("bcrypt");

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function validateHash(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {createHash, validateHash};