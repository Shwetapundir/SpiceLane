const { body } = require('express-validator');

const dishValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('imageUrl').trim().notEmpty().isURL().withMessage('Valid image URL is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be 0-5'),
  body('deliveryTime').optional().isInt({ min: 1 }).withMessage('Delivery time must be positive'),
  body('isVeg').optional().isBoolean().withMessage('isVeg must be a boolean'),
];

module.exports = { dishValidator };
