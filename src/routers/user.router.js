const { Router } = require("express");
const route = Router();
const { privateAuth } = require("../middlewares/auth.js");
const passport = require("passport");
const { register, login, logout, githubCallback, current } = require ("../controllers/user.controller.js");

route.post('/register', passport.authenticate('register', {failureRedirect: '/registerfailure'}), register)

route.get('/registerfailure', async (req, res) => {
    res.send({error: "Register failed"});
})

route.post('/login', passport.authenticate('login', {failureRedirect: '/loginfailure'}), login);

route.get('/loginfailure', (req, res) => {
    res.send({error: "Login failed"});
})

route.post('/logout', privateAuth, logout)

route.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) =>{})

route.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), githubCallback)

route.get('/current', passport.authenticate('jwt'), current)

module.exports = route