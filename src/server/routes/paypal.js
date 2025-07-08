// const express = require('express');
// const router = express.Router();
// const { createOrder, captureOrder, getClientId } = require('../controllers/paypal');

// // Get PayPal client ID for frontend
// router.get('/client-id', getClientId);

// // Create a PayPal order
// router.post('/create-order', createOrder);

// // Capture a PayPal order (complete the transaction)
// router.post('/capture-order', captureOrder);

// module.exports = router;

const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal.js');

// Get PayPal client ID for the frontend
router.get('/client-id', paypalController.getClientId);

// Create a PayPal order
router.post('/create-order', paypalController.createOrder);

// Capture a PayPal payment
router.post('/capture-order', paypalController.captureOrder);

// Test PayPal credentials
router.get('/test-credentials', paypalController.testCredentials);

module.exports = router;