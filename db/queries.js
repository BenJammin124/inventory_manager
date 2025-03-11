const pool = require("./pool");

// dashboard

async function getTotalProductCount() {
  const { rows } = await pool.query("SELECT COUNT(*) FROM product;");
  const lowProducts = await pool.query(
    "SELECT COUNT(*) FROM product WHERE quantity <= 5"
  );
  const totalSuppliers = await pool.query("SELECT COUNT(*) FROM supplier");

  return {
    total: rows[0],
    lowProducts: lowProducts.rows[0],
    totalSuppliers: totalSuppliers.rows[0],
  };
}

async function getLowProducts() {
  const { rows } = await pool.query(
    "SELECT * FROM product WHERE quantity <= 5"
  );
  return rows;
}

async function getRecentlyAddedProducts() {
  const { rows } = await pool.query(
    "SELECT * FROM product ORDER BY ID DESC LIMIT 3"
  );
  return rows;
}

//categories page
async function addNewCategory(category) {
  console.log("Inserting category:", category);
  const result = await pool.query(
    "INSERT INTO category (category_name, image_url) VALUES ($1, $2) ON CONFLICT (category_name) DO NOTHING",
    [category.category_name, category.image_url]
  );

  if (result.rowCount === 0) {
    return false;
  }
  return true;
}

async function editCategory(category) {
  console.log(category);
  const checkForCategoryName = await pool.query(
    "SELECT 1 FROM category WHERE category_name = $1 AND id != $2",
    [category.category_name, category.id]
  );

  if (checkForCategoryName.rowCount > 0) {
    return false;
  }

  await pool.query(
    "UPDATE category SET category_name = $1, image_url = $2 WHERE id = $3",
    [category.category_name, category.image_url, category.id]
  );

  return true;
}

async function editCategoryHelperReturnPreviousValue(id) {
  const { rows } = await pool.query("SELECT * FROM category WHERE id = $1", [
    id,
  ]);
  return rows[0];
}

async function findCategoryById(categoryId) {
  const { rows } = await pool.query("SELECT * FROM category WHERE id = $1", [
    categoryId,
  ]);
  return rows[0];
}

async function deleteCategory(categoryId) {
  const categoryToBeDeleted = await pool.query(
    "SELECT * FROM product WHERE category_id = $1",
    [categoryId]
  );

  if (categoryToBeDeleted.rowCount > 0) {
    return false;
  }

  await pool.query("DELETE FROM category WHERE id = $1", [categoryId]);

  return true;
}

async function productsInCategory(categoryId) {
  const { rows } = await pool.query(
    "SELECT * FROM product WHERE category_id = $1",
    [categoryId]
  );
  return rows;
}

// suppliers page
async function findSupplierById(supplierId) {
  const { rows } = await pool.query("SELECT * FROM supplier WHERE id = $1", [
    supplierId,
  ]);
  return rows[0];
}

async function addNewSupplier(supplier) {
  await pool.query(
    "INSERT INTO supplier (supplier_name, email, phone, image_url) VALUES ($1, $2, $3, $4)",
    [supplier.supplier_name, supplier.email, supplier.phone, supplier.image_url]
  );
}

async function editSupplier(supplier) {
  await pool.query(
    "UPDATE supplier SET supplier_name = $1, email = $2, phone = $3, image_url = $4 WHERE id = $5",
    [
      supplier.supplier_name,
      supplier.email,
      supplier.phone,
      supplier.image_url,
      supplier.id,
    ]
  );
}

async function deleteSupplier(supplierId) {
  await pool.query("DELETE FROM supplier WHERE id = $1", [supplierId]);
}
// products page

async function getAllProducts() {
  const { rows } = await pool.query(
    "SELECT product.id, product.product_name, product.quantity, product.price, product.unit, category.category_name, supplier.supplier_name, product.image_url FROM product " +
      "LEFT JOIN category ON category.id = product.category_id " +
      "LEFT JOIN supplier ON supplier.id = product.supplier_id ORDER BY id ASC"
  );

  console.log(rows);
  return rows;
}

async function findProductById(id) {
  const { rows } = await pool.query(
    "SELECT product.id, product.product_name, product.quantity, product.price, product.unit, category.category_name, supplier.supplier_name, product.image_url FROM product " +
      "LEFT JOIN category ON category.id = product.category_id " +
      "LEFT JOIN supplier ON supplier.id = product.supplier_id " +
      "WHERE product.id = $1",
    [id]
  );
  return rows[0];
}

async function getCategoryNames() {
  const { rows } = await pool.query(
    "SELECT category.id, category_name, COUNT(category_id), category.image_url FROM category LEFT JOIN product ON category.id = category_id GROUP BY category.id, category_name ORDER BY category.id"
  );
  return rows;
}

async function getSupplierNames() {
  const { rows } = await pool.query(
    "SELECT supplier_id, supplier_name, COUNT(1), supplier.image_url, supplier.email, supplier.phone FROM product LEFT JOIN supplier ON supplier_id = supplier.id GROUP BY supplier_name, supplier_id, supplier.image_url, supplier.email, supplier.phone ORDER BY supplier_id"
  );
  return rows;
}

async function addNewProduct(product) {
  await pool.query(
    "INSERT INTO product (product_name, quantity, price, unit, category_id, supplier_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      product.product_name,
      product.quantity,
      product.price,
      product.unit,
      product.category_id,
      product.supplier_id,
      product.image_url,
    ]
  );
}

async function findProductIdByName(product) {
  const { rows } = await pool.query(
    "SELECT id FROM product WHERE product_name = $1",
    [product]
  );

  return rows[0];
}

async function editProduct(product) {
  await pool.query(
    "UPDATE product SET product_name = $1, quantity = $2, price = $3, unit = $4, category_id = $5, supplier_id = $6, image_url = $7 WHERE id = $8",
    [
      product.product_name,
      product.quantity,
      product.price,
      product.unit,
      product.category_id,
      product.supplier_id,
      product.image_url,
      product.id,
    ]
  );
}

async function deleteProduct(product) {
  await pool.query("DELETE FROM product WHERE id = $1", [product.id]);
}

module.exports = {
  getAllProducts,
  findProductById,
  getCategoryNames,
  getSupplierNames,
  addNewProduct,
  editProduct,
  findProductIdByName,
  deleteProduct,
  getTotalProductCount,
  productsInCategory,
  findCategoryById,
  addNewCategory,
  editCategory,
  editCategoryHelperReturnPreviousValue,
  deleteCategory,
  findSupplierById,
  addNewSupplier,
  editSupplier,
  deleteSupplier,
  getLowProducts,
  getRecentlyAddedProducts,
};
