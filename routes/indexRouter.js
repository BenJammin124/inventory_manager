//./routes/indexRouters.js
const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.indexHome);
indexRouter.get("/low-inventory", indexController.lowInventory);

module.exports = { indexRouter };
