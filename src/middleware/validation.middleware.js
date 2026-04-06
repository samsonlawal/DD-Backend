/**
 * Generic Joi validation middleware
 * @param {Object} schema - Joi schema object
 * @param {string} property - The property to validate (body, query, params)
 */
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false, // Include all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const cleanErrors = error.details.map((detail) => {
        const message = detail.message.replace(/\"/g, "");
        return message.charAt(0).toUpperCase() + message.slice(1);
      });

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: cleanErrors,
      });
    }

    // Replace req[property] with the validated and stripped value
    // This ensures only allowed fields reach the controllers
    const { value } = schema.validate(req[property], { stripUnknown: true });
    req[property] = value;
    
    next();
  };
};

module.exports = validate;
