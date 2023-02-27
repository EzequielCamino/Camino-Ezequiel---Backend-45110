const { Router } = require("express");
const fs = require('fs');
const route = Router();
const CartManager = require('../CartManager.js');
const cartManager = new CartManager('./carts.json');

route.post("/", async (req, res) => {
    const response = await cartManager.addCart();
    response ?
    res.status(201).send({message: 'Cart successfully created'})
    : res.status(500).send({error: 'Cart not created'});
})

route.get("/:cid", async (req, res) => {
    const id = Number(req.params.cid);
    const carts = await cartManager.getCarts();
    const cid = carts.find((cart) => cart.id === id);
    if (cid) {
        res.send(cid);
    } else {
        res.send({error: "Cart ID not found"});
    }
});

route.post("/:cid/product/:pid", async(req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const response = await cartManager.addProductToCart(cid, pid);
    response ?
    res.status(201).send({message: 'Product successfully added to cart'})
    : res.status(400).send({error: 'Product was not added. Cart ID not found'});
})

module.exports = route;