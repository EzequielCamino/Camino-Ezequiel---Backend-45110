const { Router } = require("express");
const route = Router();

route.post('/setcookie', (req,res) =>{
    res.cookie('MyCookie', req.body, {maxAge:10000}).send('Cookie');
})

route.get('/getcookie', (req,res)=>{
    const cookie = req.cookies;
    console.log(cookie);
    res.send(cookie);
    req.session.user = user
})

/* route.get('/login', (req, res) => {
    const { username, password } = req.query;
    if (username !== 'admin' || password !== 'admin') {
      res.status(401).send({ error: 'Usuario o contraseña incorrectos' });
      return;
    }
    req.session.user = username;
    req.session.admin = true;
    res.send({ login: 'ok' });
}); */

module.exports = route