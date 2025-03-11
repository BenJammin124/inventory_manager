//./routes/productsRouters.js
const { Router } = require("express");
const productsRouter = Router();
const productsController = require("../controllers/productsController");
const { getProductById } = require("../controllers/productsController");

productsRouter.get("/", productsController.productsPage);
productsRouter.get("/product/add", productsController.productAddForm);
productsRouter.get("/product/edit/:id", getProductById);
productsRouter.post("/product/add", productsController.submitNewProductForm);
productsRouter.post("/product/editConfirm", productsController.editProduct);

productsRouter.post("/delete/:id", productsController.deleteProduct);

module.exports = { productsRouter };
