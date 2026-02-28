const express = require('express');
const router = express.Router();
const { getUserOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getUserOrders);
router.get('/all', authorizeAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorizeAdmin, updateOrderStatus);

module.exports = router;
