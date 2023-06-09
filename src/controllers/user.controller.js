const UserService = require("../dao/services/mongo/user.service.js");
const { generateToken } = require("../utils/jwt.js")
const logger = require('../utils/winston.js');

const register = async (req, res) => {
    logger.info(`User ${req.user.email} registered`);
    res.status(200).send(req.user);
}

const login = async (req, res) => {
    if(!req.user) {
        req.user = null;
        return res.status(401).send({error: 'wrong mail or password'});
    }
    const token = generateToken({
        _id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role
    })
    res.cookie('jwt', token, {
        httpOnly: true,
        /* secure: true, */
        maxAge: 3600000
    })
    logger.info(`User ${req.user.email} logged in`);
    req.session.user = req.user.email;
    req.session.role = req.user.role;
    res.redirect('/products');
}

const logout = async (req, res) => {
    logger.info(`User ${req.session.user} logged out`);
    req.session.destroy((error) =>{
        if(error){
            res.status(500).send({error: error})
        } else {
            res.redirect('/api/sessions/login')
        }
    })
}

const githubCallback = async (req, res) => {
    logger.info(`User ${req.user.email} logged in`);
    req.session.user = req.user.email;
    req.session.role = req.user.role;
    res.redirect('/products');
}

const current = async (req, res) => {
    try {
        delete req.user._id;
        res.send({message: req.user});
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    register,
    login,
    logout,
    githubCallback,
    current
}