const CartModel = require("../dao/services/mongo/models/cart.model.js");
const TicketService = require('../dao/services/mongo/ticket.service.js');
const { sendPurchaseMail } = require('../utils/mail.js');
const config = require('../config/config.js');
let CartService;
let ProductService;
if(config.PERSISTENCE === "fs") {
    CartService = require("../dao/services/fs/cart.fs.service.js");
    ProductService = require("../dao/services/fs/product.fs.service.js");
} else {
    CartService = require("../dao/services/mongo/cart.service.js");
    ProductService = require("../dao/services/mongo/product.service.js");
}
const logger = require('../utils/winston.js');
const usersModel = require("../dao/services/mongo/models/user.model.js");
const configureSocket = require("../config/configure-socket.js");


const create = async (req, res) => {
    try {
        const response = await CartService.create();
        res.status(201).send({message: `Cart successfully created with ID:${response._id}`})
    } catch (error) {
        logger.error('Handled error', error);
        res.status(500).send({error: 'Cart not created'});
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.cid;
        const cid = await CartModel.findById(id).populate('products.product');
        res.status(200).send(cid);
    } catch (error) {
        logger.error('Handled error', error);
        res.status(404).send({error: "Cart ID not found"});
    }
}

const addProduct = async (req, res) => {
    try {
        let cid = req.params.cid;
        const pid = req.params.pid;
        const product = await ProductService.findById(pid);
        if(product.owner === res.user.email){
            return res.status(403).send({warn: "You can't add your own products to cart"});
        }
        let cart = await CartService.findById(cid)
        console.log(cart)
        if(!cart){
            const user = req.user;
            cart = await CartService.create();
            user.cart._id = cart._id;
            await usersModel.findByIdAndUpdate({_id: user._id}, user);
            cid = cart._id
        }
        const productExists = cart.products.find(products=> products.product == pid);
        if(productExists){
            cart.products.find(products=> products.product == pid).quantity++
        } else{
            cart.products.push({product: pid, quantity: 1})
        }
        await CartService.findByIdAndUpdate({_id: cid}, cart);
        res.status(201).send({message: `Product with ID ${pid} successfully added to cart`})
    } catch (error) {
        logger.error('Handled error', error);
        res.status(400).send({error: 'Product was not added. Cart or product ID not found'});
    }
}

const updateCart = async (req, res) => {
    try {
        const id = req.params.cid;
        const data= req.body;
        await CartService.findByIdAndUpdate(id, data);
        res.status(201).send({ModificatedCartID: id})
    } catch (error) {
        logger.error('Handled error', error);
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
        logger.error('Handled error', error);
        res.status(404).send({error: 'Cart not updated. ID not found'})
    }
}

const removeCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        await CartService.findByIdAndDelete(cid);
        return res.status(201).send({DeletedCartID: cid})
    } catch (error) {
        logger.error('Handled error', error);
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
        res.status(404).send({error: 'Product not deleted. Cart ID not found'});
    }
}

const purchase = async (req, res) => {
    try {
        const id = req.params.cid;
        const cart = await CartService.findById(id);
        const buyableCart = [];
        const newCart = [];
        for(item of cart.products){
            const product = await ProductService.findById(item.product)
            if(product.stock >= item.quantity){
                const newQty = product.stock - item.quantity;
                await ProductService.findByIdAndUpdate(product._id, {"stock": newQty});
                const newItem = item.toObject();
                newItem.price = product.price
                buyableCart.push(newItem);
            } else {
                newCart.push(item);
            }
        }
        const purchaser = req.user.email;
        const amount = buyableCart.reduce((total, product) => total + (product.price * product.quantity), 0);
        const ticket = {
            amount,
            purchaser
        }
        await TicketService.create(ticket);
        await sendPurchaseMail(amount, purchaser);
        let result = await CartService.findByIdAndUpdate(id, {products: newCart})
        res.status(200).send({message: 'Purchase completed', NotBuyedProducts: newCart}); 
    } catch (error) {
        logger.error('Handled error', error);
        res.status(404).send({error: 'Purchase not completed. Cart ID not found'});
    }
}

module.exports = {
    create,
    getById,
    addProduct,
    updateCart,
    updateProduct,
    removeCart,
    removeProduct,
    purchase
}
