const express = require("express");
const userOrderRoutes = require("./routes/v1/user/order.routes");
const adminOrderRoutes = require("./routes/v1/admin/order.routes");
const adminProductRoutes = require("./routes/v1/admin/product.routes");
const userProductRoutes = require("./routes/v1/user/product.routes");
const adminUserRoutes = require("./routes/v1/admin/user.routes");
const userProfileRoutes = require("./routes/v1/user/profile.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user/orders", userOrderRoutes);
app.use("/api/user/products", userProductRoutes);
app.use("/api/user/profile", userProfileRoutes);

app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/users", adminUserRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

module.exports = app;
