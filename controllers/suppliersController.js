//indexController.js
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const links = [
  { href: "/products", text: "Products" },
  { href: "/categories", text: "Categories" },
  { href: "/suppliers", text: "Suppliers" },
];

exports.suppliersPage = async (req, res) => {
  const suppliers = await db.getSupplierNames();

  console.log(suppliers);
  res.render("suppliers", {
    title: "Suppliers",
    links: links,
    date: res.locals.date,
    suppliers: suppliers,
  });
};

exports.supplierAddForm = async (req, res) => {
  try {
    res.render("supplier/add", {
      title: "Add New Supplier",
      links: links,
      date: res.locals.date,
      supplierName: "",
      supplierPhone: "",
      supplierEmail: "",
      imageUrl: "",
    });
  } catch (error) {
    console.error("Error fetching supplier form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.supplierEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierEdit = await db.findSupplierById(id);
    res.render("supplier/edit", {
      title: "Edit Supplier",
      links: links,
      supplier: supplierEdit,
      date: res.locals.date,
    });
  } catch (error) {
    console.error("Error fetching supplier edit form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.submitNewSupplierForm = async (req, res) => {
  try {
    const newSupplier = req.body;
    const defaultImage = "https://placehold.co/150x150?text=Default+Pic";

    if (!newSupplier.imageUrl) {
      newSupplier.imageUrl = defaultImage;
    }

    await db.addNewSupplier({
      supplier_name: newSupplier.supplierName,
      email: newSupplier.email,
      phone: newSupplier.phone,
      image_url: newSupplier.imageUrl,
    });

    res.redirect("/suppliers");
  } catch (error) {
    console.error("Error while adding new supplier", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editSupplier = async (req, res) => {
  try {
    const editSupplier = req.body;

    await db.editSupplier({
      supplier_name: editSupplier.supplierName,
      email: editSupplier.email,
      phone: editSupplier.phone,
      image_url: editSupplier.imageUrl,
      id: editSupplier.supplierId,
    });

    res.redirect("/suppliers");
  } catch (error) {
    console.error("Error while making changes to supplier", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.deleteSupplier(id);

    res.redirect("/suppliers");
  } catch (error) {
    console.error("Error while attempting to delete supplier", error);
    res.status(500).send("Internal Server Error");
  }
};
