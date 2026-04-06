const Joi = require("joi");

// Reuseable ID schema for mongoDB ObjectId
const mongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("Invalid ID format");

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  username: Joi.string().trim().min(3).max(30).alphanum(),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().trim().min(10).pattern(/^\+?[0-9\s\-\(\)]+$/).message("Invalid phone number format").max(15),
  dob: Joi.date().iso().max("now").custom((value, helpers) => {
    const age = Math.floor((new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365.25));
    if (age < 18) {
      return helpers.message("You must be at least 18 years of age to purchase from this store.");
    }
    return value;
  }),
  gender: Joi.string().valid("male", "female", "non-binary", "other", "prefer not to say"),
  profileImage: Joi.string().allow(""),
});

const addressSchema = Joi.object({
  addressLine1: Joi.string().required().trim().max(200),
  addressLine2: Joi.string().allow("").trim().max(200),
  city: Joi.string().required().trim().max(100),
  state: Joi.string().required().trim().max(100),
  postCode: Joi.string().required().trim().max(20),
  phone: Joi.string().required().trim().pattern(/^\+?[0-9\s\-\(\)]+$/).message("Invalid phone number format").max(15),
  country: Joi.string().required().trim().max(100),
  isDefault: Joi.boolean().default(false),
});

const checkoutSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    product: mongoId.required(),
    quantity: Joi.number().integer().min(1).required(),
    image: Joi.string().allow(""),
    name: Joi.string().allow(""),
  })).min(1).required(),
  couponCode: Joi.string().allow("").trim().max(50),
  paymentMethod: Joi.string().valid("card", "cash", "transfer").required(),
  shippingAddress: addressSchema.required(),
  ageVerified: Joi.boolean().required().invalid(false).messages({
    "any.invalid": "You must confirm that you are 18 years of age or older",
    "any.required": "Age verification is required"
  }),
});

module.exports = {
  mongoId,
  updateProfileSchema,
  addressSchema,
  checkoutSchema,
};
