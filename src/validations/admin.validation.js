const Joi = require("joi");

// Reuseable ID schema for mongoDB ObjectId
const mongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("Invalid ID format");

const brandSchema = Joi.object({
  name: Joi.string().required().trim().max(100),
  description: Joi.string().allow("").trim().max(500),
  image: Joi.string().allow("").uri().optional(),
});

const categorySchema = Joi.object({
  name: Joi.string().required().trim().max(100),
  description: Joi.string().allow("").trim().max(500),
  image: Joi.string().allow("").uri().optional(),
});

const tagSchema = Joi.object({
  name: Joi.string().required().trim().max(50),
  description: Joi.string().allow("").trim().max(200),
});

const productSchema = Joi.object({
  name: Joi.string().required().trim().max(200),
  description: Joi.string().required().trim(),
  basePrice: Joi.number().min(0),
  costPrice: Joi.number().required().min(0),
  category: Joi.string().required(),
  brand: Joi.string().allow(""),
  subCategory: Joi.string().allow(""),
  availableQuantity: Joi.number().integer().min(0).default(0),
  lowStockThreshold: Joi.number().integer().min(0).default(10),
  status: Joi.string().valid("active", "inactive").default("active"),
  badge: Joi.string().allow(""),
  shippingWeight: Joi.number().min(0),
  shippingClass: Joi.string().valid("standard", "fragile").default("standard"),
  dimensions: Joi.string().allow(""),
  images: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string()
  ),
  specifications: Joi.alternatives().try(
    Joi.object().pattern(Joi.string(), Joi.any()),
    Joi.string().allow("")
  ),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().allow("")
  ),
  existingImages: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string().allow("")
  ),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("Pending", "Processing", "Shipped", "Delivered", "Cancelled").required(),
  message: Joi.string().allow("").trim().max(500),
});

const adminUpdateUserSchema = Joi.object({
  name: Joi.string().trim().max(100),
  email: Joi.string().email().lowercase().trim(),
  username: Joi.string().trim().min(3).max(30).alphanum(),
  role: Joi.string().valid("customer", "admin"),
  isActive: Joi.boolean(),
  phone: Joi.string().trim().pattern(/^\+?[0-9\s\-\(\)]+$/).message("Invalid phone number format").max(15),
});

module.exports = {
  mongoId,
  brandSchema,
  categorySchema,
  tagSchema,
  productSchema,
  updateOrderStatusSchema,
  adminUpdateUserSchema,
};
