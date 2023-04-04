const { Router } = require("express");
const route = Router();
const cartManager = require("../dao/cart.manager")
const cartModel = require("../dao/models/cart.model")

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
        const cid = await cartModel.findById(id).populate('products.product');
        res.status(200).send(cid);
    } catch (error) {
        res.status(404).send({error: "Cart ID not found"});
    }
});

route.post("/:cid/product/:pid", async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartManager.findById(cid)
        const productExists = cart.products.find(products=> products.product == pid);
        if(productExists){
            cart.products.find(products=> products.product == pid).quantity++
        } else{
            cart.products.push({product: pid, quantity: 1})
        }
        await cartManager.findByIdAndUpdate(cid, cart);
        res.status(201).send({message: 'Product successfully added to cart'})
    } catch (error) {
        res.status(400).send({error: 'Product was not added. Cart ID not found'});
    }
})

route.delete("/:cid", async (req, res) =>{
    try {
        const cid = req.params.cid;
        await cartManager.findByIdAndDelete(cid);
        return res.status(201).send({DeletedCartID: cid})
    } catch (error) {
        res.status(404).send({error: 'Cart not deleted. ID not found'});
    }
})

route.put("/:cid", async(req,res)=>{
    try {
        const id = req.params.cid;
        const data= req.body;
        await cartManager.findByIdAndUpdate(id, data);
        res.status(201).send({ModificatedCartID: id})
    } catch (error) {
        res.status(404).send({error: 'Cart not updated. ID not found'})
    }
})

route.put("/:cid/products/:pid", async(req,res)=>{
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartManager.findById(cid)
        const newQty= req.body;
        cart.products.find(products=> products.product == pid).quantity = newQty.quantity;
        await cartManager.findByIdAndUpdate(cid, cart)
        res.status(201).send({ModificatedCartID: cid})
    } catch (error) {
        res.status(404).send({error: 'Cart not updated. ID not found'})
    }
})

route.delete("/:cid/products/:pid", async (req,res)=>{
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartManager.findById(cid);
        const productIndex = cart.products.findIndex(products=> products.product == pid);
        if(productIndex === -1){
            res.status(404).send({error: 'Product not deleted. Product ID not found'});
            return
        }
        cart.products.splice(productIndex, 1)
        await cartManager.findByIdAndUpdate(cid, cart)
        res.status(201).send({EliminatedProductID: pid})
    } catch (error) {
        res.status(404).send({error: 'Product not deleted. Cart ID not found'})
    }
})

module.exports = route;