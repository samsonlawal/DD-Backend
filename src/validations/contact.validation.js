const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required().trim().max(100),
  email: Joi.string().email().required().lowercase().trim(),
  subject: Joi.string().required().trim().max(200),
  message: Joi.string().required().trim().max(2000),
});

module.exports = {
  contactSchema,
};
