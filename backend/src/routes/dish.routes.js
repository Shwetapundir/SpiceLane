const router = require('express').Router();
const { getAllDishes, getDishById, getCategories } = require('../controllers/dish.controller');

router.get('/', getAllDishes);
router.get('/categories', getCategories);
router.get('/:id', getDishById);

module.exports = router;
