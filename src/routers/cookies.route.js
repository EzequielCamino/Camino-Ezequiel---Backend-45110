const { Router } = require("express");
const route = Router();

route.post('/setcookie', (req,res) =>{
    res.cookie('MyCookie', req.body, {maxAge:10000, httpOnly:true}).send('Cookie');
})

route.get('/getcookie', (req,res)=>{
    console.log(document.cookie)
    const cookie = req.cookies;
    console.log(cookie);
    res.send(cookie);
})

module.exports = route