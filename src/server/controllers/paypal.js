
// const fetch = require('node-fetch');
// const dotenv = require('dotenv');

// dotenv.config();

// // PayPal API credentials
// const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
// const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
// const BASE_URL = process.env.NODE_ENV === 'production' 
//   ? 'https://api-m.paypal.com' 
//   : 'https://api-m.sandbox.paypal.com';

// // Get PayPal access token
// async function generateAccessToken() {
//   try {
//     if (!CLIENT_ID || !CLIENT_SECRET) {
//       console.error('PayPal credentials are not configured. Check your .env file.');
//       throw new Error('PayPal credentials are not configured');
//     }
    
//     const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
//     const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
//       method: 'POST',
//       body: 'grant_type=client_credentials',
//       headers: {
//         Authorization: `Basic ${auth}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });
    
//     const data = await response.json();
    
//     if (data.error) {
//       console.error('PayPal authentication error:', data);
//       throw new Error(`PayPal authentication error: ${data.error_description || data.error}`);
//     }
    
//     return data.access_token;
//   } catch (error) {
//     console.error('Failed to generate PayPal access token:', error);
//     throw new Error('Failed to generate PayPal authentication token');
//   }
// }

// // Controller to provide the client ID to frontend
// exports.getClientId = (req, res) => {
//   console.log('Receiving request for PayPal client ID');
  
//   if (!CLIENT_ID) {
//     console.error('PayPal client ID is not configured in .env file');
//     return res.status(500).json({ 
//       error: 'PayPal client ID is not configured',
//       message: 'Please check your server .env file and add PAYPAL_CLIENT_ID'
//     });
//   }
  
//   console.log('Providing PayPal client ID to frontend');
//   res.json({ clientId: CLIENT_ID });
// };

// // Create a PayPal order
// exports.createOrder = async (req, res) => {
//   try {
//     const { amount, currency = 'USD', description } = req.body;
    
//     if (!amount) {
//       return res.status(400).json({ error: 'Amount is required' });
//     }

//     const accessToken = await generateAccessToken();
//     const url = `${BASE_URL}/v2/checkout/orders`;
    
//     const payload = {
//       intent: 'CAPTURE',
//       purchase_units: [
//         {
//           amount: {
//             currency_code: currency,
//             value: amount.toString(),
//           },
//           description: description || 'Cloud App Purchase',
//         },
//       ],
//       application_context: {
//         brand_name: 'Cloud App Store',
//         landing_page: 'NO_PREFERENCE',
//         user_action: 'PAY_NOW',
//       },
//     };

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();
    
//     if (data.error) {
//       console.error('PayPal API error:', data);
//       return res.status(500).json({ error: 'Failed to create PayPal order', details: data });
//     }
    
//     res.json(data);
//   } catch (error) {
//     console.error('Error creating PayPal order:', error);
//     res.status(500).json({ 
//       error: 'Failed to create PayPal order',
//       message: error.message 
//     });
//   }
// };

// // Capture a PayPal order (finalize the transaction)
// exports.captureOrder = async (req, res) => {
//   try {
//     const { orderID } = req.body;
    
//     if (!orderID) {
//       return res.status(400).json({ error: 'Order ID is required' });
//     }

//     const accessToken = await generateAccessToken();
//     const url = `${BASE_URL}/v2/checkout/orders/${orderID}/capture`;

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const data = await response.json();
    
//     if (data.error) {
//       console.error('PayPal API error:', data);
//       return res.status(500).json({ error: 'Failed to capture PayPal order', details: data });
//     }
    
//     res.json(data);
//   } catch (error) {
//     console.error('Error capturing PayPal order:', error);
//     res.status(500).json({ 
//       error: 'Failed to capture PayPal order',
//       message: error.message 
//     });
//   }
// };


const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

// PayPal API credentials
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function generateAccessToken() {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('PayPal credentials are not configured. Check your .env file.');
      throw new Error('PayPal credentials are not configured');
    }
    
    console.log('Generating PayPal access token using credentials');
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('PayPal authentication error:', data);
      throw new Error(`PayPal authentication error: ${data.error_description || data.error}`);
    }
    
    console.log('PayPal access token generated successfully');
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate PayPal access token:', error);
    throw new Error('Failed to generate PayPal authentication token');
  }
}

// Controller to provide the client ID to frontend
exports.getClientId = (req, res) => {
  console.log('Receiving request for PayPal client ID');
  
  if (!CLIENT_ID) {
    console.error('PayPal client ID is not configured in .env file');
    return res.status(500).json({ 
      error: 'PayPal client ID is not configured',
      message: 'Please check your server .env file and add PAYPAL_CLIENT_ID'
    });
  }
  
  if (CLIENT_ID === 'YOUR_PAYPAL_CLIENT_ID') {
    console.warn('Using placeholder PayPal client ID. Please update with a real one');
    return res.status(500).json({
      error: 'Invalid PayPal client ID',
      message: 'You are using the placeholder client ID. Please update your .env file with a real PayPal client ID'
    });
  }
  
  console.log('Providing PayPal client ID to frontend');
  res.json({ clientId: CLIENT_ID });
};

// Create a PayPal order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'USD', description } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    console.log(`Creating PayPal order for amount: ${amount} ${currency}`);
    const accessToken = await generateAccessToken();
    const url = `${BASE_URL}/v2/checkout/orders`;
    
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: description || 'Cloud App Purchase',
        },
      ],
      application_context: {
        brand_name: 'Cloud App Store',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel'
      },
    };

    console.log('Sending create order request to PayPal API');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'PayPal-Request-Id': `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.status >= 400) {
      console.error('PayPal API error creating order:', data);
      return res.status(response.status).json({ error: 'Failed to create PayPal order', details: data });
    }
    
    console.log('PayPal order created successfully:', data.id);
    res.json(data);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to create PayPal order',
      message: error.message 
    });
  }
};

// Capture a PayPal order (finalize the transaction)
exports.captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    
    if (!orderID) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    console.log(`Capturing PayPal order: ${orderID}`);
    const accessToken = await generateAccessToken();
    const url = `${BASE_URL}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'PayPal-Request-Id': `capture-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      },
    });

    const data = await response.json();
    
    if (response.status >= 400) {
      console.error('PayPal API error capturing order:', data);
      return res.status(response.status).json({ error: 'Failed to capture PayPal order', details: data });
    }
    
    console.log('PayPal order captured successfully');
    res.json(data);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to capture PayPal order',
      message: error.message 
    });
  }
};

// Add a test endpoint to verify PayPal credentials
exports.testCredentials = async (req, res) => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID === 'YOUR_PAYPAL_CLIENT_ID') {
      return res.status(500).json({
        success: false,
        message: 'PayPal credentials not properly configured in .env file'
      });
    }

    // Test by generating a token
    const accessToken = await generateAccessToken();
    res.json({
      success: true,
      message: 'PayPal credentials are valid',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('PayPal credentials test failed:', error);
    res.status(500).json({
      success: false,
      message: `PayPal credentials test failed: ${error.message}`
    });
  }
};