// app.js
const express = require("express");
const app = express();
const { indexRouter } = require("./routes/indexRouter");
const { categoriesRouter } = require("./routes/categoriesRouter");
const { suppliersRouter } = require("./routes/suppliersRouter");
const { productsRouter } = require("./routes/productsRouter");
const path = require("node:path");

app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  res.locals.date = formattedDate;
  next();
});

app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/suppliers", suppliersRouter);
app.use("/products", productsRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
