const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    // Mock payment intent (replace with Razorpay/Stripe later)
    const paymentIntent = {
      id: `pay_${Date.now()}`,
      amount,
      currency: 'inr',
      status: 'created',
    };

    res.json({ success: true, paymentIntent });
  } catch (err) {
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { paymentId } = req.body;
    // Mock verification
    res.json({ success: true, paymentId, status: 'verified' });
  } catch (err) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;