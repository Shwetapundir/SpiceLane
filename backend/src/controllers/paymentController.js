const stripe = require('../config/stripe');
const prisma = require('../config/database');

const createCheckoutSession = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { dish: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.round((subtotal + deliveryCharge + platformFee + gst) * 100) / 100;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.dish.name,
          description: item.dish.description.substring(0, 100),
          images: [item.dish.imageUrl],
        },
        unit_amount: Math.round(item.dish.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery charge as line item
    if (deliveryCharge > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Delivery Charge' },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      });
    }

    // Add platform fee
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Platform Fee' },
        unit_amount: platformFee * 100,
      },
      quantity: 1,
    });

    // Add GST
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'GST (5%)' },
        unit_amount: Math.round(gst * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        userId: req.user.id,
        subtotal: subtotal.toString(),
        deliveryCharge: deliveryCharge.toString(),
        platformFee: platformFee.toString(),
        gst: gst.toString(),
        grandTotal: grandTotal.toString(),
      },
    });

    res.json({ success: true, data: { sessionId: session.id, url: session.url } });
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await handlePaymentSuccess(session);
  }

  res.json({ received: true });
};

const handlePaymentSuccess = async (session) => {
  try {
    const { userId, subtotal, deliveryCharge, platformFee, gst, grandTotal } = session.metadata;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { dish: true },
    });

    if (cartItems.length === 0) return;

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: 'CONFIRMED',
          totalAmount: parseFloat(subtotal),
          deliveryCharge: parseFloat(deliveryCharge),
          platformFee: parseFloat(platformFee),
          gst: parseFloat(gst),
          grandTotal: parseFloat(grandTotal),
          stripeSessionId: session.id,
          orderItems: {
            create: cartItems.map((item) => ({
              dishId: item.dishId,
              quantity: item.quantity,
              price: item.dish.price,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { userId } });
      return order;
    });
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed.' });
    }

    // Find the order created by webhook (or create if webhook hasn't fired yet)
    let order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: { orderItems: { include: { dish: true } } },
    });

    if (!order) {
      // Fallback: create order if webhook hasn't processed yet
      await handlePaymentSuccess(session);
      order = await prisma.order.findUnique({
        where: { stripeSessionId: sessionId },
        include: { orderItems: { include: { dish: true } } },
      });
    }

    res.json({ success: true, data: { order, session } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCheckoutSession, handleWebhook, verifyPayment };
