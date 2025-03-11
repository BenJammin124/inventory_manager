//./routes/categoriesRouters.js
const { Router } = require("express");
const categoriesRouter = Router();
const categoriesController = require("../controllers/categoriesController");

categoriesRouter.get("/", categoriesController.categoriesPage);
categoriesRouter.get("/category/add", categoriesController.categoryAddForm);
categoriesRouter.get(
  "/category/edit/:id",
  categoriesController.categoryEditForm
);
categoriesRouter.post(
  "/category/add",
  categoriesController.submitNewCategoryForm
);
categoriesRouter.post(
  "/category/editConfirm",
  categoriesController.editCategory
);
categoriesRouter.post("/delete/:id", categoriesController.deleteCategory);

module.exports = { categoriesRouter };
