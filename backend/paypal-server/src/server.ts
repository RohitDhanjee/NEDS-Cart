// import express, { Express, Request, Response, NextFunction } from 'express';
// // import express = require('express');
// import cors from 'cors';
// import paypal from '@paypal/checkout-server-sdk';
// import dotenv from 'dotenv';

// dotenv.config();

// // 1. Type-safe environment validation
// type EnvVars = {
//   PAYPAL_CLIENT_ID: string;
//   PAYPAL_CLIENT_SECRET: string;
//   PORT?: string;
// };

// const env = process.env as NodeJS.ProcessEnv & EnvVars;

// if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
//   throw new Error('Missing PayPal credentials in .env file');
// }

// // 2. Express app with explicit typing
// const app: Express = express();
// app.use(cors());
// app.use(express.json());

// // 3. PayPal configuration with type assertions
// const environment = new paypal.core.SandboxEnvironment(
//   env.PAYPAL_CLIENT_ID,
//   env.PAYPAL_CLIENT_SECRET
// ) as paypal.core.SandboxEnvironment;

// const client = new paypal.core.PayPalHttpClient(environment);

// // 4. Type-safe route handler factory
// const routeHandler = <T = any>(handler: (req: Request, res: Response) => Promise<T>) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await handler(req, res);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// // 5. Create Order Endpoint
// app.post(
//   '/api/create-paypal-order',
//   routeHandler(async (req: Request, res: Response) => {
//     const amount = Number(req.body.amount);
    
//     if (isNaN(amount)) {
//       return res.status(400).json({ error: 'Invalid amount format' });
//     }

//     const request = new paypal.orders.OrdersCreateRequest();
//     request.requestBody({
//       intent: 'CAPTURE',
//       purchase_units: [{
//         amount: {
//           currency_code: 'USD',
//           value: amount.toFixed(2),
//           breakdown: {
//             item_total: {
//               currency_code: 'USD',
//               value: amount.toFixed(2)
//             }
//           }
//         }
//       }]
//     });

//     const response = await client.execute(request);
//     res.json({ orderID: (response.result as { id: string }).id });
//   })
// );

// // 6. Capture Payment Endpoint
// app.post(
//   '/api/capture-paypal-payment',
//   routeHandler(async (req: Request, res: Response) => {
//     const { orderID } = req.body as { orderID?: string };
    
//     if (!orderID) {
//       return res.status(400).json({ error: 'orderID is required' });
//     }

//     const request = new paypal.orders.OrdersCaptureRequest(orderID);
//     const response = await client.execute(request);
//     res.json({ status: (response.result as { status: string }).status });
//   })
// );

// // 7. Error handling with type guards
// app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof Error) {
//     console.error('Error:', err.message);
//     return res.status(500).json({ error: err.message });
//   }
//   res.status(500).json({ error: 'Unknown error occurred' });
// });

// // 8. Start server
// const PORT = env.PORT ? parseInt(env.PORT) : 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// import express from 'express';
// const app = express();
// app.get('/', (req, res) => res.send('Works!'));
// app.listen(3001, () => console.log('Server running'));

import express from 'express';
import cors from 'cors';
import paypalRouter from './routes/paypal.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PayPal Routes
app.use('/api', paypalRouter);

// Error Handling Middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});