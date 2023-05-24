const { Router } = require("express");
const route = Router();
const { upload, getAll, getById, create, update, remove } = require("../controllers/product.controller.js")
const { adminAuth } = require("../middlewares/auth.js");

route.get("/", getAll);
route.get("/:pid", getById);
route.post("/", adminAuth, upload, create);
route.put("/:pid", adminAuth, update);
route.delete("/:pid", adminAuth, remove);

module.exports = route;