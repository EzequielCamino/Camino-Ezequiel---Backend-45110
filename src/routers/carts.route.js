const { Router } = require("express");
const route = Router();
const CartController = require('../controllers/cart.controller.js')
const { create, getById, addProduct, updateCart, updateProduct, removeCart, removeProduct, purchase } = require('../controllers/cart.controller.js');
const { userAuth } = require("../middlewares/auth.js")
const passport = require("passport");

route.post("/", create.bind(CartController));
route.get("/:cid", getById);
route.post("/:cid/products/:pid", userAuth, addProduct);
route.delete("/:cid", removeCart);
route.put("/:cid", updateCart);
route.put("/:cid/products/:pid", updateProduct);
route.delete("/:cid/products/:pid", removeProduct);
route.post('/:cid/purchase', userAuth, purchase);

module.exports = route;