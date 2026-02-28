const prisma = require('../config/prisma');

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { dish: { select: { name: true, imageUrl: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, deliveryCharge, platformFee, gst, grandTotal } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ error: 'No items in order' });

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        subtotal: totalAmount || 0,
        deliveryCharge: deliveryCharge || 0,
        platformFee: platformFee || 0,
        gst: gst || 0,
        total: grandTotal || 0,  // schema uses "total" not "grandTotal"
        status: 'PENDING',
        items: {
          create: items.map((item) => ({
            dishId: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price),
            name: item.name,  // schema requires "name"
          })),
        },
      },
      include: { items: { include: { dish: true } } },
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// Admin: get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserOrders, getOrderById, createOrder, getAllOrders };
