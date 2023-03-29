const { Router } = require("express");
const route = Router();
const cartManager = require("../dao/cart.manager")

route.post("/", async (req, res) => {
    try {
        const response = await cartManager.create();
        res.status(201).send({message: `Cart successfully created with ID:${response._id}`})
    } catch (error) {
        res.status(500).send({error: 'Cart not created'});
    }
})

route.get("/:cid", async (req, res) => {
    try {
        const id = req.params.cid;
        const cid = await cartManager.findById(id);
        res.status(200).send(cid);
    } catch (error) {
        res.status(404).send({error: "Cart ID not found"});
    }
});

route.post("/:cid/product/:pid", async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const response = await cartManager.addProductToCart(cid, pid);
        res.status(201).send({message: 'Product successfully added to cart'})
    } catch (error) {
        res.status(400).send({error: 'Product was not added. Cart ID not found'});
    }
})

module.exports = route;