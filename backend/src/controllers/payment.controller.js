const stripe = require('../config/stripe');
const prisma = require('../config/prisma');
const logger = require('../config/logger');

const createCheckoutSession = async (req, res, next) => {
  try {
    const { items, subtotal, deliveryCharge, platformFee, gst, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Add fees as separate line items
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Delivery + Platform Fee + GST' },
        unit_amount: Math.round((parseFloat(deliveryCharge) + parseFloat(platformFee) + parseFloat(gst)) * 100),
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
        total: total.toString(),
        itemsJson: JSON.stringify(items.map(i => ({
          dishId: i.id,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
        }))),
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
};

const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      await createOrderFromSession(session);
    } catch (err) {
      logger.error('Error creating order from webhook:', err);
    }
  }

  res.json({ received: true });
};

const verifySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Check if order already exists
    let order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: { items: true },
    });

    // If not yet created via webhook, create it now
    if (!order) {
      order = await createOrderFromSession(session);
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

async function createOrderFromSession(session) {
  const existing = await prisma.order.findUnique({ where: { stripeSessionId: session.id } });
  if (existing) return existing;

  const metadata = session.metadata;
  const items = JSON.parse(metadata.itemsJson);

  const order = await prisma.order.create({
    data: {
      userId: metadata.userId,
      subtotal: parseFloat(metadata.subtotal),
      deliveryCharge: parseFloat(metadata.deliveryCharge),
      platformFee: parseFloat(metadata.platformFee),
      gst: parseFloat(metadata.gst),
      total: parseFloat(metadata.total),
      status: 'CONFIRMED',
      stripeSessionId: session.id,
      items: {
        create: items.map(item => ({
          dishId: item.dishId,
          quantity: item.quantity,
          price: parseFloat(item.price),
          name: item.name,
        })),
      },
    },
    include: { items: true },
  });

  return order;
}

module.exports = { createCheckoutSession, handleWebhook, verifySession };
