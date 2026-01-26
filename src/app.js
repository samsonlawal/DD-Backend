const express = require("express");

const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

module.exports = app;
