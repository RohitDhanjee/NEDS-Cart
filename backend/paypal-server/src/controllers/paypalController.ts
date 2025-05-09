import { Request, Response } from 'express';
import { PayPalService } from '../services/paypal';

export const PayPalController = {
  async createOrder(req: Request, res: Response) {
    try {
      const { amount } = req.body;
      
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const orderId = await PayPalService.createOrder(amount);
      res.json({ orderId });
      
    } catch (error) {
      console.error('PayPal Create Order Error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  async capturePayment(req: Request, res: Response) {
    try {
      const { orderID } = req.body;
      
      if (!orderID) {
        return res.status(400).json({ error: 'Missing order ID' });
      }

      const result = await PayPalService.capturePayment(orderID);
      res.json(result);
      
    } catch (error) {
      console.error('PayPal Capture Error:', error);
      res.status(500).json({ 
        error: 'Payment capture failed',
        details: error instanceof Error ? error.message : undefined
      });
    }
  }
};