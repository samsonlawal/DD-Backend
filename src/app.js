const express = require("express");

const productRoutes = require("./routes/v1/product.routes");
const userRoutes = require("./routes/v1/user.routes");
const userOrderRoutes = require("./routes/v1/user/order.routes");
const adminOrderRoutes = require("./routes/v1/admin/order.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user/orders", userOrderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

module.exports = app;
