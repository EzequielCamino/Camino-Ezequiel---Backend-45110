const { Router } = require("express");
const route = Router();
const usersModel = require('../dao/models/user.model.js');
const { privateAuth } = require("../utils/auth.js");
const {createHash, validateHash} = require("../utils/bcrypt.js");
const passport = require("passport");

/* route.post('/register', async (req,res) => {
    const user = req.body;
    const hash = createHash(user.password);
    try {
        const response = await usersModel.create({...user, password: hash});
        res.status(200).send(response);
    } catch(error) {
        res.status(500).send({message: error})
    }
}) */

route.post('/register', passport.authenticate('register', {failureRedirect: '/registerfailure'}), async (req, res) => {
    res.status(200).send(req.user);
})
route.get('/registerfailure', async (req, res) => {
    res.send({error: "Register failed"});
})

/* route.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.role = "admin";
    } else {
        const user = await usersModel.findOne({email});
        if (!user || !validateHash(password, user.password)) {
            return res.status(401).send({error: 'wrong mail or password'});
        }
        req.session.role = "usuario";
    }
    req.session.user = email;
    res.redirect('/products')
}) */

route.post('/login', passport.authenticate('login', {failureRedirect: '/loginfailure'}), async (req,res) =>{
    if(!req.user) {
        req.user = null;
        return res.status(401).send({error: 'wrong mail or password'});
    }
    req.session.user = req.user.email;
    req.session.user === "adminCoder@coder.com" ?
    req.session.role = "admin" :
    req.session.role = "user";
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

route.get('/github', passport.authenticate('github', {scope: ['user: email']}), async (req, res) =>{})

route.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) =>{
    req.session.user = req.user;
    req.session.role = "user";
    res.redirect('/products');
})

module.exports = route