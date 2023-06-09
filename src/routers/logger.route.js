const { Router } = require("express");
const route = Router();
const { loggerTest } = require('../controllers/logger.controller.js');

route.get("/loggerTest", loggerTest);

module.exports = route;