const { Router } = require("express");
const route = Router();
const { privateAuth } = require("../utils/auth.js");
const passport = require("passport");
const { generateToken, verifyToken } = require("../utils/jwt.js")
const usersModel = require("../dao/models/user.model.js");

route.post('/register', passport.authenticate('register', {failureRedirect: '/registerfailure'}), async (req, res) => {
    res.status(200).send(req.user);
})
route.get('/registerfailure', async (req, res) => {
    res.send({error: "Register failed"});
})

route.post('/login', passport.authenticate('login', {failureRedirect: '/loginfailure'}), async (req,res) =>{
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
    req.session.user = req.user.email;
    /* req.session.user === "adminCoder@coder.com" ?
    req.session.role = "admin" : */
    req.session.role = req.user.role;
    res.redirect('/products');
})
route.get('/loginfailure', (req, res) => {
    res.send({error: "Login failed"});
})

route.post('/logout', privateAuth, async (req, res) => {
    req.session.destroy((error) =>{
        if(error){
            res.status(500).send({error: error})
        } else {
            res.redirect('/api/sessions/login')
        }
    })
})

route.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) =>{})

route.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) =>{
    req.session.user = req.user.email;
    req.session.role = req.user.role;
    res.redirect('/products');
})

route.get('/current', passport.authenticate('jwt'), async (req, res) => {
    try {
        res.send({message: req.user});
    } catch (error) {
        res.send(error)
    }
})

module.exports = route