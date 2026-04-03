const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().required().trim().max(50),
  username: Joi.string().required().trim().min(3).max(30).alphanum(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
});

const verifyCodeSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  code: Joi.string().length(6).required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  code: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6),
  new_password: Joi.string().min(6),
}).xor("newPassword", "new_password");

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyCodeSchema,
  resetPasswordSchema,
};
