const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const xssCleaner = require("./middleware/sanitization.middleware");

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

const adminBrandRoutes = require("./routes/v1/admin/brand.routes");
const userBrandRoutes = require("./routes/v1/user/brand.routes");

const adminAuthRoutes = require("./routes/v1/admin/auth.routes");
const userAuthRoutes = require("./routes/v1/user/auth.routes");

const webhookRoutes = require("./routes/webhook.routes");
const contactRoutes = require("./routes/v1/contact.routes");
const newsletterRoutes = require("./routes/v1/user/newsletter.routes");

const app = express();

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://discountdrinks.vercel.app",
  "https://discount-drinks-admin.vercel.app",
];

app.set("trust proxy", 1);

// Global CORS middleware
// app.use((req, res, next) => {
// const origin = req.headers.origin;
// if (allowedOrigins.includes(origin)) {
//   res.setHeader("Access-Control-Allow-Origin", origin);
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE, OPTIONS",
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization",
//   );
// }

// origin: [
//   "http://localhost:3000",
//   "https://discountdrinks.vercel.app",
//   "https://discount-drinks-admin.vercel.app",
//   "*",
// ];

// Handle preflight requests
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }

//   next();
// });

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://discount-drinks-frontend-git-staging-samsons-projects-c84cc3b1.vercel.app",
      "https://discountdrinksandmoreltd.co.uk",
      "https://discount-drinks-staging.vercel.app",

      "https://discountdrinks.vercel.app",
      "https://discount-drinks-admin.vercel.app",
      "*",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    // Important if you're sending cookies/auth headers
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

// Webhooks must be mounted BEFORE express.json() so the raw body parser works
app.use("/api/webhooks", webhookRoutes);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security middlewares
app.use(helmet());
app.use(xssCleaner);

// adminPassword@123
// admin@discountdrinks.com

app.use("/api/user/orders", userOrderRoutes);
app.use("/api/user/products", userProductRoutes);
app.use("/api/user/profile", userProfileRoutes);
app.use("/api/user/tags", userTagRoutes);
app.use("/api/user/categories", userCategoryRoutes);
app.use("/api/user/brands", userBrandRoutes); 
app.use("/api/user/auth", userAuthRoutes);
app.use("/api/user/contact", contactRoutes);
app.use("/api/user/newsletter", newsletterRoutes);


app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/tags", adminTagRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/brands", adminBrandRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

module.exports = app;
