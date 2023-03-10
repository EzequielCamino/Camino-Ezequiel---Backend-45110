const { Router } = require("express");
const route = Router();
const ProductManager = require("../ProductManager.js");
const productManager = new ProductManager("./data/products.json");

route.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    if(products.length < 1) {
        res.render('notFound', {
            title: "Backend 45110",
            style: "style"
        });
        return
    }
    res.render('index', {
        title: "Backend 45110",
        style: "style",
        products
    });
});

module.exports = route;