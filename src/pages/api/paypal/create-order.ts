// pages/api/paypal/create-order.ts
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
    const { amount, currency, items } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency || 'USD',
          value: amount.toString(),
          breakdown: {
            item_total: {
              currency_code: currency || 'USD',
              value: amount.toString()
            }
          }
        },
        items: items.map((item: any) => ({
          name: item.name,
          unit_amount: {
            currency_code: currency || 'USD',
            value: item.price.toString()
          },
          quantity: item.quantity.toString()
        }))
      }]
    });

    const response = await client().execute(request);
    res.status(200).json({ orderID: response.result.id });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
}