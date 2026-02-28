const express = require('express');
const router = express.Router();
const {
  getAllDishes,
  getDishById,
  getCategories,
  createDish,
  updateDish,
  deleteDish,
} = require('../controllers/dishController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { dishValidator } = require('../validators/dishValidators');
const { validate } = require('../middleware/validate');

router.get('/', getAllDishes);
router.get('/categories', getCategories);
router.get('/:id', getDishById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, dishValidator, validate, createDish);
router.put('/:id', authenticate, authorizeAdmin, dishValidator, validate, updateDish);
router.delete('/:id', authenticate, authorizeAdmin, deleteDish);

module.exports = router;
