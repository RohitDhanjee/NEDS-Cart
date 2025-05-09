import express from 'express';
import { PayPalController } from '../controllers/paypalController';

const router = express.Router();

router.post('/create-paypal-order', PayPalController.createOrder);
router.post('/capture-paypal-payment', PayPalController.capturePayment);

export default router;