const Joi = require("joi");

const subscribeSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
});

module.exports = {
  subscribeSchema,
};
