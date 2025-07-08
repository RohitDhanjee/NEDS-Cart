
// // const express = require('express');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const dotenv = require('dotenv');
// // const paypalRoutes = require('./routes/paypal');

// // // Load environment variables
// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Check for required environment variables
// // if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
// //   console.error('\x1b[31m%s\x1b[0m', '⚠️  WARNING: PayPal credentials missing in .env file');
// //   console.log('\x1b[33m%s\x1b[0m', '➡️  Please copy .env.example to .env and set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
// // }

// // // Middleware
// // app.use(cors());
// // app.use(bodyParser.json());

// // // Request logging middleware
// // app.use((req, res, next) => {
// //   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
// //   next();
// // });

// // // Routes
// // app.use('/api/paypal', paypalRoutes);

// // // Basic route for testing
// // app.get('/api/health', (req, res) => {
// //   res.status(200).send({ 
// //     status: 'ok', 
// //     message: 'Server is running',
// //     environment: process.env.NODE_ENV || 'development',
// //     paypalConfigured: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
// //   });
// // });

// // // Error handling middleware
// // app.use((err, req, res, next) => {
// //   console.error('Server error:', err);
// //   res.status(500).json({ error: 'Internal Server Error', message: err.message });
// // });

// // // Start server
// // app.listen(PORT, () => {
// //   console.log(`\x1b[32m%s\x1b[0m`, `✅ Server running on port ${PORT}`);
// //   console.log(`\x1b[36m%s\x1b[0m`, `   Health check: http://localhost:${PORT}/api/health`);
  
// //   if (process.env.NODE_ENV !== 'production') {
// //     console.log(`\x1b[33m%s\x1b[0m`, '   Running in development mode');
// //   }
  
// //   if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
// //     console.log(`\x1b[31m%s\x1b[0m`, '   ⚠️  PayPal integration may not work - credentials missing');
// //   } else {
// //     console.log(`\x1b[32m%s\x1b[0m`, '   PayPal credentials loaded successfully');
// //   }
// // });

// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const {
//     ApiError,
//     CheckoutPaymentIntent,
//     Client,
//     Environment,
//     LogLevel,
//     OrdersController,
//     PaymentsController,
//     PaypalExperienceLandingPage,
//     PaypalExperienceUserAction,
//     ShippingPreference,
// } =require( "@paypal/paypal-server-sdk");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const {
//     PAYPAL_CLIENT_ID,
//     PAYPAL_CLIENT_SECRET,
//     PORT = 5000,
// } = process.env;

// // // Generate PayPal OAuth token
// // const generateAccessToken = async () => {
// //   try {
// //     const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 
// //       'grant_type=client_credentials', 
// //       {
// //         auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_CLIENT_SECRET },
// //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
// //       }
// //     );
// //     return response.data.access_token;
// //   } catch (error) {
// //     console.error('Error generating access token:', error);
// //   }
// // };
// const client = new Client({
//     clientCredentialsAuthCredentials: {
//         oAuthClientId: PAYPAL_CLIENT_ID,
//         oAuthClientSecret: PAYPAL_CLIENT_SECRET,
//     },
//     timeout: 0,
//     environment: Environment.Sandbox,
//     logging: {
//         logLevel: LogLevel.Info,
//         logRequest: { logBody: true },
//         logResponse: { logHeaders: true },
//     },
// }); 

// const ordersController = new OrdersController(client);
// const paymentsController = new PaymentsController(client);

// // Create PayPal order
// app.post('/api/paypal/create-order', async (req, res) => {
//   const { amount, description } = req.body;
// //   const accessToken = await generateAccessToken();

//   const orderData = {
//     intent: 'CAPTURE',
//     purchase_units: [{ amount: { currency_code: 'USD', value: amount }, description }],
//   };

//   try {
//     // const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, orderData, {
//     //   headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
//     // });
//     const { orderData, ...httpResponse } = await ordersController.createOrder(
//         collect
//     );
//     return {
//         jsonResponse: JSON.parse(orderData),
//         httpStatusCode: httpResponse.statusCode,
//     };

//     // res.json({ orderID: response.data.id });
//   } catch (error) {
//     console.error('Error creating PayPal order:', error);
//     res.status(500).send('Failed to create order');
//   }
// });

// // Capture PayPal payment
// app.post('/api/paypal/capture-order', async (req, res) => {
//   const { orderID } = req.body;
//   const accessToken = await generateAccessToken();

//   try {
//     const { orderData, ...httpResponse } = await ordersController.captureOrder(
//         collect
//     );
//     // Get more response info...
//     // const { statusCode, headers } = httpResponse;
//     return {
//         jsonResponse: JSON.parse(orderData),
//         httpStatusCode: httpResponse.statusCode,}
//     // const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {}, {
//     //   headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
//     // });
//     // res.json(response.data);
//   } catch (error) {
//     console.error('Error capturing PayPal order:', error);
//     res.status(500).send('Failed to capture order');
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const paypalRoutes = require('./routes/paypal.js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Check for required environment variables
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error('\x1b[31m%s\x1b[0m', '⚠️  WARNING: PayPal credentials missing in .env file');
  console.log('\x1b[33m%s\x1b[0m', '➡️  Please copy .env.example to .env and set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
}

// Check if using placeholder values
if (process.env.PAYPAL_CLIENT_ID === 'YOUR_PAYPAL_CLIENT_ID' || 
    process.env.PAYPAL_CLIENT_SECRET === 'YOUR_PAYPAL_SECRET') {
  console.error('\x1b[31m%s\x1b[0m', '⚠️  WARNING: Using placeholder PayPal credentials');
  console.log('\x1b[33m%s\x1b[0m', '➡️  Please update .env with your real PayPal credentials');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/paypal', paypalRoutes);

// Enhanced health check endpoint
app.get('/api/health', (req, res) => {
  // Check PayPal credentials
  const hasValidCredentials = !!(
    process.env.PAYPAL_CLIENT_ID && 
    process.env.PAYPAL_CLIENT_SECRET &&
    process.env.PAYPAL_CLIENT_ID !== 'YOUR_PAYPAL_CLIENT_ID' &&
    process.env.PAYPAL_CLIENT_SECRET !== 'YOUR_PAYPAL_SECRET'
  );

  const credentialStatus = hasValidCredentials 
    ? 'valid' 
    : process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
      ? 'using placeholder values'
      : 'missing';

  res.status(200).send({ 
    status: 'ok', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    paypalConfigured: hasValidCredentials,
    paypalCredentialStatus: credentialStatus,
    serverTime: new Date().toISOString(),
    apiEndpoints: {
      getClientId: '/api/paypal/client-id',
      createOrder: '/api/paypal/create-order',
      captureOrder: '/api/paypal/capture-order',
      testCredentials: '/api/paypal/test-credentials'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `✅ Server running on port ${PORT}`);
  console.log(`\x1b[36m%s\x1b[0m`, `   Health check: http://localhost:${PORT}/api/health`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\x1b[33m%s\x1b[0m`, '   Running in development mode');
  }
  
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET || 
      process.env.PAYPAL_CLIENT_ID === 'YOUR_PAYPAL_CLIENT_ID' || 
      process.env.PAYPAL_CLIENT_SECRET === 'YOUR_PAYPAL_SECRET') {
    console.log(`\x1b[31m%s\x1b[0m`, '   ⚠️  PayPal integration may not work - credentials missing or using placeholders');
    console.log(`\x1b[31m%s\x1b[0m`, '   ⚠️  Copy .env.example to .env and add your PayPal credentials');
  } else {
    console.log(`\x1b[32m%s\x1b[0m`, '   PayPal credentials loaded successfully');
  }
});