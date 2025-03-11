//productsController.js
const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { body, validationResult } = require("express-validator");

const links = [
  { href: "/products", text: "Products" },
  { href: "/categories", text: "Categories" },
  { href: "/suppliers", text: "Suppliers" },
];

exports.productsPage = async (req, res) => {
  try {
    const products = await db.getAllProducts();

    res.render("products", {
      title: "Products",
      products: products,
      links: links,
      date: res.locals.date,
    });
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.productAddForm = async (req, res) => {
  const categories = await db.getCategoryNames();
  const suppliers = await db.getSupplierNames();
  res.render("product/add", {
    title: "Add new product",
    links: links,
    date: res.locals.date,
    categories: categories,
    suppliers: suppliers,
  });
};

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.findProductById(Number(id));
  const categories = await db.getCategoryNames();
  const suppliers = await db.getSupplierNames();
  console.log(product);

  if (!product) {
    throw new CustomNotFoundError("Server Error: Cannot find product;");
  }

  res.render("product/edit", {
    title: `Edit ${product.product_name}`,
    links: links,
    date: res.locals.date,
    product: product,
    categories: categories,
    suppliers: suppliers,
  });
});

exports.submitNewProductForm = async (req, res) => {
  const newProduct = req.body;

  const defaultImage = "https://placehold.co/150x150?text=Default+Pic";
  if (!newProduct.imageUrl) {
    newProduct.imageUrl = defaultImage;
  }
  await db.addNewProduct({
    product_name: newProduct.productName,
    quantity: newProduct.quantity,
    price: newProduct.price,
    unit: newProduct.unit,
    supplier_id: newProduct.supplier,
    category_id: newProduct.category,
    image_url: newProduct.imageUrl,
  });
  res.redirect("/products");
};

exports.editProduct = async (req, res) => {
  const editProduct = req.body;

  await db.editProduct({
    id: editProduct.productId,
    product_name: editProduct.productName,
    quantity: editProduct.quantity,
    price: editProduct.price,
    unit: editProduct.unit,
    supplier_id: editProduct.supplier,
    category_id: editProduct.category,
    image_url: editProduct.imageUrl,
  });
  res.redirect("/products");
};

exports.deleteProduct = async (req, res) => {
  const productToDelete = req.params;

  await db.deleteProduct({
    id: productToDelete.id,
  });
  res.redirect("/products");
};

exports.getProductById = getProductById;
