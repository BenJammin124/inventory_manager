//./routes/suppliersRouters.js
const { Router } = require("express");
const suppliersRouter = Router();
const suppliersController = require("../controllers/suppliersController");

suppliersRouter.get("/", suppliersController.suppliersPage);
suppliersRouter.get("/supplier/add", suppliersController.supplierAddForm);
suppliersRouter.get("/supplier/edit/:id", suppliersController.supplierEditForm);
suppliersRouter.post(
  "/supplier/add",
  suppliersController.submitNewSupplierForm
);
suppliersRouter.post("/supplier/editConfirm", suppliersController.editSupplier);
suppliersRouter.post("/delete/:id", suppliersController.deleteSupplier);

module.exports = { suppliersRouter };
