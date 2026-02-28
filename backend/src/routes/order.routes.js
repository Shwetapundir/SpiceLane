const router = require('express').Router();
const { getUserOrders, getOrderById, createOrder } = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getUserOrders);
router.post('/', createOrder);       // 👈 added
router.get('/:id', getOrderById);

module.exports = router;
