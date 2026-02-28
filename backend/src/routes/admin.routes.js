const router = require('express').Router();
const { body } = require('express-validator');
const { createDish, updateDish, deleteDish } = require('../controllers/dish.controller');
const { getAllOrders } = require('../controllers/order.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate, requireAdmin);

const dishValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('imageUrl').isURL(),
  body('category').trim().notEmpty(),
];

router.post('/dishes', dishValidation, validate, createDish);
router.put('/dishes/:id', updateDish);
router.delete('/dishes/:id', deleteDish);
router.get('/orders', getAllOrders);

module.exports = router;
