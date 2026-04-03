const xss = require("xss");

/**
 * Sanitizes an object or string recursively.
 * @param {any} input 
 * @returns {any}
 */
const sanitize = (input) => {
  if (typeof input === "string") {
    return xss(input);
  }
  if (Array.isArray(input)) {
    return input.map(sanitize);
  }
  if (typeof input === "object" && input !== null) {
    const sanitizedObj = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitizedObj[key] = sanitize(input[key]);
      }
    }
    return sanitizedObj;
  }
  return input;
};

/**
 * Global sanitization middleware to prevent XSS.
 * This middleware cleans req.body, req.query, and req.params.
 */
const xssCleaner = (req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

module.exports = xssCleaner;
