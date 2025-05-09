
import { supabase } from '../integrations/supabase/client.ts';
import { CartItem } from '../pages/Cart.tsx';

// Generate receipt HTML for email
export const generateReceiptHtml = (
  orderId: string,
  customerName: string,
  customerEmail: string,
  items: CartItem[],
  total: number,
  address: string,
  selectedVariation: string,
) => {
  const receiptDate = new Date().toLocaleDateString();
  const receiptId = orderId ? orderId.substring(0, 8).toUpperCase() : 'CLD-000000';
  
  // Generate items HTML
  let itemsHtml = '';
  items.forEach(item => {
    const itemTotal = calculateItemTotal(item);
    itemsHtml += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${itemTotal.toFixed(2)}</td>
      </tr>
    `;
    
    // Add selected features if any
    if (item.selectedFeatures && item.selectedFeatures.length > 0) {
      item.selectedFeatures.forEach(feature => {
        itemsHtml += `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; padding-left: 20px;">+ ${feature.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${feature.price.toFixed(2)}</td>
          </tr>
        `;
      });
    }
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Receipt #${receiptId}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 20px;
          margin-top: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .receipt-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .customer-info, .order-info {
          flex: 1;
        }
        .thank-you {
          text-align: center;
          margin-top: 30px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border-bottom: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .total-row {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>CloudApp</h1>
          <h2>Payment Receipt</h2>
        </div>
        
        <div class="receipt-info">
          <div class="order-info">
            <p><strong>Receipt #:</strong> ${receiptId}</p>
            <p><strong>Date:</strong> ${receiptDate}</p>
          </div>
          
          <div class="customer-info">
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Billing Address:</strong> ${address}</p>
          </div>
        </div>
        
        <h3>Order Details</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr class="total-row">
              <td colspan="2" style="text-align: right; padding: 12px;"><strong>Total:</strong></td>
              <td style="padding: 12px;"><strong>$${total.toFixed(2)}/${selectedVariation}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div class="thank-you">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Calculate total for an item including features
export const calculateItemTotal = (item: CartItem) => {
  const featuresCost = item.selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
  return (item.product.price + featuresCost) * item.quantity;
};

// Send email with receipt
export const sendReceiptEmail = async (
  to: string, 
  subject: string, 
  html: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html }
    });
    
    if (error) {
      console.error('Error sending receipt email:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending receipt email:', err);
    return { success: false, error: err };
  }
};


// import { CartItem } from '../pages/Cart.tsx'

// /**
//  * Calculates the total cost for a single item
//  */
// export const calculateItemTotal = (item: CartItem) => {
//   const featuresCost = item.selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
//   return (item.product.price + featuresCost) * item.quantity;
// };

// /**
//  * Calculates the total cost for all items in cart
//  */
// export const calculateTotal = (cartItems: CartItem[]) => {
//   if (!cartItems || !Array.isArray(cartItems)) {
//     return 0; // Return 0 if cartItems is undefined or not an array
//   }
//   return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
// };

// /**
//  * Determines the billing period text based on cart items
//  */
// export const getBillingPeriodText = (cartItems: CartItem[]) => {
//   if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
//     return "Monthly"; // Default fallback
//   }
  
//   const durations = cartItems.map(item => {
//     if (item.selectedVariation && item.selectedVariation.duration) {
//       return item.selectedVariation.duration;
//     }
//     return "monthly";
//   });
  
//   const uniqueDurations = [...new Set(durations)];
//   if (uniqueDurations.length === 1) {
//     const duration = uniqueDurations[0].toLowerCase();
//     if (duration === "annual" || duration === "yearly") return "Yearly";
//     if (duration === "quarterly") return "Quarterly";
//     if (duration === "biannual" || duration === "semi-annual") return "Biannual";
//     return "Monthly";
//   }
  
//   return "Various (see details)";
// };

// /**
//  * Generates HTML for email receipts with dynamic billing period
//  */
// export const generateReceiptEmailContent = (
//   orderId: string, 
//   cartItems: CartItem[], 
//   customerName: string
// ) => {
//   const receiptDate = new Date().toLocaleDateString();
//   const receiptId = orderId ? orderId.substring(0, 8).toUpperCase() : 'CLD-000000';
//   const billingPeriod = getBillingPeriodText(cartItems);
//   const total = calculateTotal(cartItems);
  
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
//       <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
//         <h1 style="color: #333; margin: 0;">CloudApp</h1>
//         <h2 style="color: #333; margin: 10px 0 0 0;">Order Confirmation</h2>
//       </div>
      
//       <div style="margin-bottom: 20px;">
//         <p><strong>Receipt #:</strong> ${receiptId}</p>
//         <p><strong>Date:</strong> ${receiptDate}</p>
//         <p><strong>Customer:</strong> ${customerName}</p>
//       </div>
      
//       <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Information</h3>
      
//       <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
//         <thead>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f8f8f8;">Product</th>
//             <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f8f8f8;">Features</th>
//             <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f8f8f8;">Quantity</th>
//             <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f8f8f8;">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${cartItems.map(item => `
//             <tr>
//               <td style="border: 1px solid #ddd; padding: 10px;">${item.product.name} ${item.selectedVariation ? `(${item.selectedVariation.duration})` : ''}</td>
//               <td style="border: 1px solid #ddd; padding: 10px;">${item.selectedFeatures.length > 0 ? item.selectedFeatures.map(f => f.name).join(', ') : 'None'}</td>
//               <td style="border: 1px solid #ddd; padding: 10px;">${item.quantity}</td>
//               <td style="border: 1px solid #ddd; padding: 10px;">$${calculateItemTotal(item).toFixed(2)}</td>
//             </tr>
//           `).join('')}
//           <tr>
//             <td colspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: right;"><strong>Total:</strong></td>
//             <td style="border: 1px solid #ddd; padding: 10px;"><strong>$${total.toFixed(2)}</strong></td>
//           </tr>
//         </tbody>
//       </table>
      
//       <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
//         <h4 style="margin-top: 0;">Billing Details</h4>
//         <p><strong>Billing Period:</strong> ${billingPeriod}</p>
//         <p><strong>Amount:</strong> $${total.toFixed(2)}/${billingPeriod.toLowerCase()}</p>
//       </div>
      
//       <div style="text-align: center; margin-top: 30px; color: #555;">
//         <p>Thank you for your business!</p>
//         <p style="font-size: 12px; color: #999;">
//           If you have any questions, please contact our support team.
//         </p>
//       </div>
//     </div>
//   `;
// };

// /**
//  * Generates HTML for subscription expiration reminder emails
//  */
// export const generateExpirationReminderContent = (
//   customerName: string,
//   expirationDate: string,
//   productDetails: string,
//   billingPeriod: string,
//   amount: number
// ) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
//       <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
//         <h1 style="color: #333; margin: 0;">CloudApp</h1>
//         <h2 style="color: #333; margin: 10px 0 0 0;">Subscription Expiration Reminder</h2>
//       </div>
      
//       <p>Dear ${customerName},</p>
      
//       <p>This is a friendly reminder that your subscription will expire on <strong>${expirationDate}</strong>.</p>
      
//       <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//         <h4 style="margin-top: 0;">Subscription Details</h4>
//         <p><strong>Product:</strong> ${productDetails}</p>
//         <p><strong>Billing Period:</strong> ${billingPeriod}</p>
//         <p><strong>Amount:</strong> $${amount.toFixed(2)}/${billingPeriod.toLowerCase()}</p>
//         <p><strong>Expiration Date:</strong> ${expirationDate}</p>
//       </div>
      
//       <p>To continue enjoying our services without interruption, please renew your subscription before the expiration date.</p>
      
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Renew Now</a>
//       </div>
      
//       <p>If you have any questions or need assistance, please feel free to contact our support team.</p>
      
//       <div style="text-align: center; margin-top: 30px; color: #555;">
//         <p>Thank you for choosing CloudApp!</p>
//         <p style="font-size: 12px; color: #999;">
//           If you've already renewed your subscription, please disregard this message.
//         </p>
//       </div>
//     </div>
//   `;
// };