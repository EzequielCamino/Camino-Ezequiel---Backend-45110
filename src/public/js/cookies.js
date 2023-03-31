const { Router } = require("express");
const route = Router();

function getCookie(){
    route.get('/', (req,res) =>{
        const cookies = req.cookies
        console.log(cookies);
        res.send(cookies);
    })
}

function setCookie() {
    const user = document.getElementById('user');
    const userEmail = document.getElementById('userEmail');
    route.post('/', (req,res) => {
        res.cookie('MyCookie', {user: userEmail}, {maxAge: 10000}).send("Cookie")
    })
}