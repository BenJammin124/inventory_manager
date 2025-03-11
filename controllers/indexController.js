//indexController.js
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const links = [
  { href: "/products", text: "Products" },
  { href: "/categories", text: "Categories" },
  { href: "/suppliers", text: "Suppliers" },
];

exports.indexHome = async (req, res) => {
  try {
    const productCount = await db.getTotalProductCount();
    const recentlyAdded = await db.getRecentlyAddedProducts();

    res.render("index", {
      title: "Dashboard",
      links: links,
      date: res.locals.date,
      totalProducts: productCount.total.count,
      lowProducts: productCount.lowProducts.count,
      suppliers: productCount.totalSuppliers.count,
      products: recentlyAdded,
    });
  } catch (error) {}
};

exports.lowInventory = async (req, res) => {
  try {
    const lowProducts = await db.getLowProducts();
    if (lowProducts.length > 1) {
      res.render("products", {
        title: "Products",
        links: links,
        date: res.locals.date,
        products: lowProducts,
      });
    } else {
      res.render("products", {
        title: "Low Inventory Products",
        links: links,
        date: res.locals.date,
        products: lowProducts,
        errorMessage: "No products low in inventory! Yay!",
      });
    }
    console.log(lowProducts);
  } catch (error) {}
};
