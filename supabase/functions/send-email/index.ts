import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";
// import { data } from "@remix-run/router/dist/utils.js";


const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from = "CloudApp <onboarding@resend.dev>" }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      throw new Error("Missing required fields: to, subject, or html");
    }

    console.log(`Sending email to ${to} with subject "${subject}"`);
    
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
    // const response = await resend.emails.send({
    //   from,
    //   to,
    //   subject,
    //   html,
    // });
    
    // if (response.error) {
    //   console.error("Error sending email:", response.error);
    //   throw new Error(`Failed to send email: ${response.error.message}`);
    // }

    console.log("Email sent successfully:", data);
    
    return new Response(JSON.stringify({ success: true, data: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// async function sendEmail(to: string, subject: string, htmlContent: string) {
//   // Implementation depends on your email service
//   console.log(`Sending email to ${to} with subject: ${subject}`);
//   console.log("Email content:", htmlContent);
  
//   // Return success for now
//   return { success: true };
// }

// // Calculate the item total
// function calculateItemTotal(item: any) {
//   if (!item || !item.selectedFeatures) {
//     return 0;
//   }
//   const featuresCost = item.selectedFeatures.reduce((sum: number, feature: any) => sum + feature.price, 0);
//   return (item.product.price + featuresCost) * item.quantity;
// }

// // Calculate the total for all items
// function calculateTotal(cartItems: any[]) {
//   if (!cartItems || !Array.isArray(cartItems)) {
//     return 0;
//   }
//   return cartItems.reduce((sum: number, item: any) => sum + calculateItemTotal(item), 0);
// }

// // Get the billing period text based on the cart items
// function getBillingPeriodText(cartItems: any[]) {
//   if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
//     return "Monthly"; // Default fallback
//   }
  
//   const durations = cartItems.map((item: any) => {
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
// }

// // Generate the receipt email HTML
// function generateReceiptEmailHTML(
//   orderId: string, 
//   cartItems: any[], 
//   customerName: string
// ) {
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
//           ${cartItems.map((item: any) => `
//             <tr>
//               <td style="border: 1px solid #ddd; padding: 10px;">${item.product.name} ${item.selectedVariation ? `(${item.selectedVariation.duration})` : ''}</td>
//               <td style="border: 1px solid #ddd; padding: 10px;">${item.selectedFeatures.length > 0 ? item.selectedFeatures.map((f: any) => f.name).join(', ') : 'None'}</td>
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
// }

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
// };

// serve(async (req) => {
//   // Handle CORS
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }
  
//   try {
//     const { orderId, cartItems, customerName, email } = await req.json();
    
//     if (!orderId || !cartItems || !customerName || !email) {
//       return new Response(
//         JSON.stringify({
//           error: "Missing required fields: orderId, cartItems, customerName, or email",
//         }),
//         {
//           status: 400,
//           headers: { ...corsHeaders, "Content-Type": "application/json" },
//         }
//       );
//     }
    
//     const emailHTML = generateReceiptEmailHTML(orderId, cartItems, customerName);
    
//     // Send the email
//     const emailResult = await sendEmail(
//       email,
//       `Order Confirmation #${orderId.substring(0, 8).toUpperCase()}`,
//       emailHTML
//     );
    
//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Receipt email sent successfully",
//       }),
//       {
//         status: 200,
//         headers: { ...corsHeaders, "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error in send-receipt function:", error);
    
//     return new Response(
//       JSON.stringify({
//         error: "Failed to send receipt email",
//         details: error,
//       }),
//       {
//         status: 500,
//         headers: { ...corsHeaders, "Content-Type": "application/json" },
//       }
//     );
//   }
// });