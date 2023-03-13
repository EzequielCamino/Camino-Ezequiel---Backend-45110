const { Router } = require("express");
const route = Router();
const ProductManager = require("../ProductManager.js");
const productManager = new ProductManager("./src/data/products.json");

route.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', {
        title: "Backend 45110",
        style: "style",
        products
    });
});

route.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {
        title: "Backend 45110",
        style: "style",
        products
    })
})

module.exports = route;