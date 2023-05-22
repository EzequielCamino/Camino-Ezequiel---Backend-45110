const CartService = require("../dao/services/cart.service.js");
const CartModel = require("../dao/models/cart.model");

const create = async (req, res) => {
    try {
        const response = await CartService.create();
        res.status(201).send({message: `Cart successfully created with ID:${response._id}`})
    } catch (error) {
        res.status(500).send({error: 'Cart not created'});
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.cid;
        const cid = await CartModel.findById(id).populate('products.product');
        res.status(200).send(cid);
    } catch (error) {
        res.status(404).send({error: "Cart ID not found"});
    }
}

const addProduct = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await CartService.findById(cid)
        const productExists = cart.products.find(products=> products.product == pid);
        if(productExists){
            cart.products.find(products=> products.product == pid).quantity++
        } else{
            cart.products.push({product: pid, quantity: 1})
        }
        await CartService.findByIdAndUpdate(cid, cart);
        res.status(201).send({message: 'Product successfully added to cart'})
    } catch (error) {
        res.status(400).send({error: 'Product was not added. Cart ID not found'});
    }
}

const updateCart = async (req, res) => {
    try {
        const id = req.params.cid;
        const data= req.body;
        await CartService.findByIdAndUpdate(id, data);
        res.status(201).send({ModificatedCartID: id})
    } catch (error) {
        res.status(404).send({error: 'Cart not updated. ID not found'})
    }
}

const updateProduct = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await CartService.findById(cid)
        const newQty= req.body;
        cart.products.find(products=> products.product == pid).quantity = newQty.quantity;
        await CartService.findByIdAndUpdate(cid, cart)
        res.status(201).send({ModificatedCartID: cid})
    } catch (error) {
        res.status(404).send({error: 'Cart not updated. ID not found'})
    }
}


const removeCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        await CartService.findByIdAndDelete(cid);
        return res.status(201).send({DeletedCartID: cid})
    } catch (error) {
        res.status(404).send({error: 'Cart not deleted. ID not found'});
    }
}

const removeProduct = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await CartService.findById(cid);
        const productIndex = cart.products.findIndex(products=> products.product == pid);
        if(productIndex === -1){
            res.status(404).send({error: 'Product not deleted. Product ID not found'});
            return
        }
        cart.products.splice(productIndex, 1)
        await CartService.findByIdAndUpdate(cid, cart)
        res.status(201).send({EliminatedProductID: pid})
    } catch (error) {
        res.status(404).send({error: 'Product not deleted. Cart ID not found'})
    }
}

module.exports = {
    create,
    getById,
    addProduct,
    updateCart,
    updateProduct,
    removeCart,
    removeProduct
}
