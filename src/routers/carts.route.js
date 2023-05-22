const { Router } = require("express");
const route = Router();
const { create, getById, addProduct, updateCart, updateProduct, removeCart, removeProduct } = require('../controllers/cart.controller.js');

route.post("/", create)
route.get("/:cid", getById);
route.post("/:cid/products/:pid", addProduct)
route.delete("/:cid", removeCart)
route.put("/:cid", updateCart)
route.put("/:cid/products/:pid", updateProduct)
route.delete("/:cid/products/:pid", removeProduct)

module.exports = route;