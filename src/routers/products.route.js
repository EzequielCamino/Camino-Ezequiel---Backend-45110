const { Router } = require("express");
const route = Router();
const { upload, getAll, getById, create, update, remove } = require("../controllers/product.controller.js")

route.get("/", getAll);
route.get("/:pid", getById);
route.post("/", upload, create);
route.put("/:pid", update);
route.delete("/:pid", remove);

module.exports = route;