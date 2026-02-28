const express = require('express');
const router = express.Router();

// Create mock payment intent
router.post('/create', async (req, res) => {
  try {
    console.log('Payment body:', req.body); // debug log

    const { amount, items, total } = req.body;

    // Accept amount or total (Cart sends total)
    const paymentAmount = amount || total || 0;

    const paymentIntent = {
      id: `pay_${Date.now()}`,
      amount: paymentAmount,
      currency: 'inr',
      status: 'created',
    };

    res.json({ success: true, paymentIntent });
  } catch (err) {
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

// Mock verify payment
router.post('/verify', async (req, res) => {
  try {
    const { paymentId } = req.body;
    res.json({ success: true, paymentId, status: 'verified' });
  } catch (err) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;
