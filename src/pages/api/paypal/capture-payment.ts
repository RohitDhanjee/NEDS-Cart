// pages/api/paypal/capture-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import paypal from '@paypal/checkout-server-sdk';

const client = () => {
  return new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    )
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderID, orderData } = req.body;
    
    // Capture the payment
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
    captureRequest.requestBody({});
    const captureResponse = await client().execute(captureRequest);

    // Here you would typically save the order to your database
    // using the orderData from the request
    
    res.status(200).json({
      status: captureResponse.result.status,
      details: captureResponse.result
    });
  } catch (error) {
    console.error('PayPal payment capture error:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
}