const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, verifySession } = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');

// Stripe webhook — raw body is applied in server.js before this route
router.post('/webhook', handleWebhook);

// Authenticated routes
router.post('/checkout-session', authenticate, createCheckoutSession);
router.get('/verify/:sessionId', authenticate, verifySession);

module.exports = router;
