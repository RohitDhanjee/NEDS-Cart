// Add this interface at the top of your file
interface PayPalOrderResponse {
    id: string;
    status: string;
    create_time: string;
    purchase_units: Array<{
      reference_id: string;
      amount: {
        currency_code: string;
        value: string;
      };
    }>;
  }

import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// PayPal Client Setup
const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => new paypal.core.PayPalHttpClient(environment());

// Service Methods
export const PayPalService = {
  async createOrder(amount: number) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: amount.toFixed(2)
            }
          }
        }
      }]
    });

    const response = await client().execute<PayPalOrderResponse>(request);
    return response.result.id;
  },

  async capturePayment(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    const response = await client().execute<PayPalOrderResponse>(request);
    return {
      status: response.result.status,
      details: response.result
    };
  }
};