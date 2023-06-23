const { Router } = require("express");
const route = Router();
const { upload, getAll, getById, create, update, remove, mockProducts } = require("../controllers/product.controller.js")
const { adminAuth, premiumAdminAuth } = require("../middlewares/auth.js");
const passport = require('passport');

route.get("/mockingproducts", mockProducts);
route.get("/", getAll);
route.get("/:pid", getById);
route.post("/", passport.authenticate('jwt'), premiumAdminAuth, upload, create);
route.put("/:pid", passport.authenticate('jwt'), adminAuth, update);
route.delete("/:pid", passport.authenticate('jwt'), premiumAdminAuth, remove);

module.exports = route;