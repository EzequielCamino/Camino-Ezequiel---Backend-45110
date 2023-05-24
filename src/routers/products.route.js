const { Router } = require("express");
const route = Router();
const { upload, getAll, getById, create, update, remove } = require("../controllers/product.controller.js")
const { adminAuth } = require("../middlewares/auth.js");
const passport = require('passport');

route.get("/", getAll);
route.get("/:pid", getById);
route.post("/", passport.authenticate('jwt'), adminAuth, upload, create);
route.put("/:pid", passport.authenticate('jwt'), adminAuth, update);
route.delete("/:pid", passport.authenticate('jwt'), adminAuth, remove);

module.exports = route;