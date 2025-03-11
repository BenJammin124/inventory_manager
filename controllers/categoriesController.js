//indexController.js
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const links = [
  { href: "/products", text: "Products" },
  { href: "/categories", text: "Categories" },
  { href: "/suppliers", text: "Suppliers" },
];

exports.categoriesPage = async (req, res) => {
  const categories = await db.getCategoryNames();

  res.render("categories", {
    title: "Categories",
    links: links,
    date: res.locals.date,
    categories: categories,
  });
};

exports.categoryAddForm = async (req, res) => {
  try {
    res.render("category/add", {
      title: "Add New Category",
      links: links,
      date: res.locals.date,
      categoryName: "",
      imageUrl: "",
    });
  } catch (error) {
    console.error("Error fetching category form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.categoryEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryEdit = await db.findCategoryById(id);
    const products = await db.productsInCategory(id);
    res.render("category/edit", {
      title: "Edit Category",
      links: links,
      category: categoryEdit,
      date: res.locals.date,
      products: products,
    });
  } catch (error) {
    console.error("Error fetching category edit form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.submitNewCategoryForm = async (req, res) => {
  try {
    const newCategory = req.body;
    const defaultImage = "https://placehold.co/150x150?text=Default+Pic";

    if (!newCategory.imageUrl) {
      newCategory.imageUrl = defaultImage;
    }

    const result = await db.addNewCategory({
      category_name: newCategory.categoryName,
      image_url: newCategory.imageUrl,
    });

    if (result) {
      res.redirect("/categories");
    } else {
      res.render("category/add", {
        errorMessage:
          "Category already exists. Please choose a different name.",
        categoryName: newCategory.categoryName,
        imageUrl: newCategory.imageUrl,
        title: "Add New Category",
        links: links,
        date: res.locals.date,
      });
    }
  } catch (error) {
    console.error("Error while adding new category", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editCategory = async (req, res) => {
  try {
    const editCategory = req.body;

    const result = await db.editCategory({
      category_name: editCategory.categoryName,
      image_url: editCategory.imageUrl,
      id: editCategory.categoryId,
    });

    if (result) {
      res.redirect("/categories");
    } else {
      const previousValues = await db.editCategoryHelperReturnPreviousValue(
        editCategory.categoryId
      );
      console.log(previousValues);
      res.render("category/edit", {
        errorMessage:
          "Category already exists. Please choose a different name.",
        title: "Edit Category",
        links: links,
        category: previousValues,
        date: res.locals.date,
      });
    }
  } catch (error) {
    console.error("Error while making changes to category", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.deleteCategory(id);

    if (result) {
      res.redirect("/categories");
    } else {
      const product = await db.findCategoryById(id);
      res.render("category/edit", {
        errorMessage:
          "Deletion is not possible as the selected category still contains associated products. Please remove all products from the category before proceeding with deletion.",
        title: "Edit Category",
        links: links,
        category: product,
        date: res.locals.date,
      });
    }
  } catch (error) {
    console.error("Error while attempting to delete category", error);
    res.status(500).send("Internal Server Error");
  }
};
