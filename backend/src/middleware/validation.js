const { validationResult } = require("express-validator");
const { sendError } = require("../utils/error");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed", {
      fields: errors.array(),
    });
  }
  next();
};

module.exports = { handleValidationErrors };
