const usersModel = require("../dao/services/mongo/models/user.model.js");
const UserService = require("../dao/services/mongo/user.service.js");
const { generateToken } = require("../utils/jwt.js")
const logger = require('../utils/winston.js');
const { sendRecoverMail } = require('../utils/mail.js');
const { createHash, validateHash } = require('../utils/bcrypt.js');

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
        res.status(200).send({message: req.user});
    } catch (error) {
        res.status(500).send(error)
    }
}

const recoveryRequest = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await usersModel.findOne({email})
        if(!user){
            return res.status(401).send({status: "error"});
        }
        const token = generateToken({
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role
        })
        await sendRecoverMail(email, token);
        return res.status(200).send({status: "success"});
    } catch (error) {
        res.status(500).send(error);
    }
}

const restore = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const mongoUser = await usersModel.findOne({email})
        const passVerification = validateHash(password, mongoUser.password)
        if(passVerification){
            return res.status(400).send({status: "passwordError"})
        }
        const hashedPassword = createHash(password)
        await usersModel.findOneAndUpdate({email}, {password: hashedPassword})
        return res.status(200).send({status:"success"});
    } catch (error) {
        return res.status(500).send({status: "error"});
    }
}

const changeRole = async (req, res) => {
    /* const role = req.user.role;
    const id = req.params.id;
    console.log(role, id)
    if (role === "user"){
        try {
            await usersModel.findOneAndUpdate({_id: id}, {role: "premium"})
            return res.status(200).send({status:"role changed to premium"});
        } catch (error) {
            return res.status(400).send({error: "User ID not found"})
        }
    }
    if (role === "premium"){
        try {
            await usersModel.findOneAndUpdate({_id: id}, {role: "user"})
            return res.status(200).send({status:"role changed to user"});
        } catch (error) {
            return res.status(400).send({error: "User ID not found"})
        }
    }
    res.status(400).send({error: "Admins can't change their role"}); */
    const id = req.params.id
    try {
        const user = await usersModel.findOne({_id: id})
        if(user.role === "admin"){
            res.status(400).send({error: "Admins can't change their role"});
        }
        if(user.role === "user"){
            try {
                await usersModel.findOneAndUpdate({_id: id}, {role: "premium"});
                return res.status(200).send({status:"role changed to premium"});
            } catch (error) {
                return res.status(500).send({error: "Something went wrong"});
            }
        }
        if(user.role === "premium"){
            try {
                await usersModel.findOneAndUpdate({_id: id}, {role: "user"});
                return res.status(200).send({status:"role changed to user"});
            } catch (error) {
                return res.status(500).send({error: "Something went wrong"});
            }
        }
    } catch (error) {
        return res.status(400).send({error: "User ID not found"});
    }
}

module.exports = {
    register,
    login,
    logout,
    githubCallback,
    current,
    recoveryRequest,
    restore,
    changeRole
}