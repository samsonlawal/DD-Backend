const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userOrderRoutes = require("./routes/v1/user/order.routes");
const adminOrderRoutes = require("./routes/v1/admin/order.routes");
const adminProductRoutes = require("./routes/v1/admin/product.routes");
const userProductRoutes = require("./routes/v1/user/product.routes");
const adminUserRoutes = require("./routes/v1/admin/user.routes");
const userProfileRoutes = require("./routes/v1/user/profile.routes");
const adminTagRoutes = require("./routes/v1/admin/tag.routes");
const userTagRoutes = require("./routes/v1/user/tag.routes");
const adminCategoryRoutes = require("./routes/v1/admin/category.routes");
const userCategoryRoutes = require("./routes/v1/user/category.routes");

const adminAuthRoutes = require("./routes/v1/admin/auth.routes");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://discountdrinks.vercel.app",
      "https://discount-drinks-admin.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options(
  "/:path(*)",
  cors({
    origin: [
      "http://localhost:3000",
      "https://discountdrinks.vercel.app",
      "https://discount-drinks-admin.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// app.options("*", cors());

// adminPassword@123
// admin@discountdrinks.com

app.use("/api/user/orders", userOrderRoutes);
app.use("/api/user/products", userProductRoutes);
app.use("/api/user/profile", userProfileRoutes);
app.use("/api/user/tags", userTagRoutes);
app.use("/api/user/categories", userCategoryRoutes);

app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/tags", adminTagRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

module.exports = app;
