const { Router } = require("express");
const route = Router();
const productManager = require("../dao/product.manager.js")

route.get('/', async (req, res) => {
    const products = await productManager.getAll();
    res.render('index', {
        title: "Backend 45110",
        style: "style",
        products
    });
});

route.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAll();
    res.render('realTimeProducts', {
        title: "Backend 45110",
        style: "style",
        products
    })
})

route.get('/chat', (req, res) => {
    res.render('message');
});

module.exports = route;