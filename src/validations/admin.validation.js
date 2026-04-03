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
  price: Joi.number().required().min(0),
  category: mongoId.required(),
  brand: mongoId.required(),
  stock: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
  images: Joi.array().items(Joi.string().uri()).default([]),
  // These might be strings due to multipart/form-data
  specifications: Joi.alternatives().try(
    Joi.object().pattern(Joi.string(), Joi.any()),
    Joi.string()
  ),
  tags: Joi.alternatives().try(
    Joi.array().items(mongoId),
    Joi.string()
  ),
  existingImages: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string()
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
