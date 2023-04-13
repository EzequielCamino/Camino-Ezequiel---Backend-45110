const { Router } = require("express");
const route = Router();
const usersModel = require('../dao/models/user.model.js');
const { privateAuth } = require("../utils/auth.js");

route.post('/register', async (req,res) => {
    const user = req.body;
    try {
        const response = await usersManager.create(user);
        res.status(200).send(response);
    } catch(error) {
        res.status(500).send({message: error})
    }
})

route.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await usersModel.findOne({email, password});
    if (!user) {
        return res.status(401).send({error: 'wrong mail or password'});
    }
    req.session.user = email;
    res.redirect('/api/sessions/profile')
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

module.exports = route