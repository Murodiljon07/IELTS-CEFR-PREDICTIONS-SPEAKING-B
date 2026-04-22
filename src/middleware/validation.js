const Joi = require("joi");

// Register validation
const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
  });
  return schema.validate(data);
};

// Login validation
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

// Update profile validation
const validateUpdateProfile = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional(),
    avatar: Joi.string().uri().optional(),
  });
  return schema.validate(data);
};

// Change password validation
const validateChangePassword = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  });
  return schema.validate(data);
};

// Forgot password validation
const validateForgotPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

// Reset password validation
const validateResetPassword = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
};
