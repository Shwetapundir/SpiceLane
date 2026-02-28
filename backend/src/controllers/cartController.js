const prisma = require('../config/database');

const getCart = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { dish: true },
      orderBy: { createdAt: 'asc' },
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? (subtotal > 500 ? 0 : 40) : 0;
    const platformFee = subtotal > 0 ? 5 : 0;
    const gst = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.round((subtotal + deliveryCharge + platformFee + gst) * 100) / 100;

    res.json({
      success: true,
      data: {
        cartItems,
        summary: { subtotal, deliveryCharge, platformFee, gst, grandTotal, itemCount: cartItems.length },
      },
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { dishId, quantity = 1 } = req.body;

    const dish = await prisma.dish.findUnique({ where: { id: dishId } });
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found.' });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_dishId: { userId: req.user.id, dishId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user.id, dishId, quantity },
      include: { dish: true },
    });

    res.json({ success: true, message: 'Item added to cart!', data: { cartItem } });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { dishId } = req.params;

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { userId_dishId: { userId: req.user.id, dishId } },
      });
      return res.json({ success: true, message: 'Item removed from cart!' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { userId_dishId: { userId: req.user.id, dishId } },
      data: { quantity },
      include: { dish: true },
    });

    res.json({ success: true, message: 'Cart updated!', data: { cartItem } });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { dishId } = req.params;
    await prisma.cartItem.delete({
      where: { userId_dishId: { userId: req.user.id, dishId } },
    });
    res.json({ success: true, message: 'Item removed from cart!' });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, message: 'Cart cleared!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
