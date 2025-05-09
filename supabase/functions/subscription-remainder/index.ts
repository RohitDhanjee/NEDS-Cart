// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Checking for subscriptions that expire in 7 days...");
    
    // Get current date and date 7 days from now
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    
    const formattedDate = sevenDaysFromNow.toISOString().split('T')[0];
    
    // Query orders with subscriptions ending in 7 days
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, 
        billing_email, 
        billing_name,
        total_amount,
        expires_at,
        order_items(
          product_id,
          quantity,
          price,
          products(name)
        )
      `)
      .eq('status', 'completed')
      .gte('expires_at', now.toISOString())
      .lt('expires_at', sevenDaysFromNow.toISOString())
      .is('reminder_sent', false);
    
    if (error) {
      throw new Error(`Failed to query orders: ${error.message}`);
    }

    console.log(`Found ${orders?.length || 0} subscriptions expiring soon`);
    
    const sentEmails = [];
    
    // Send reminder emails for each expiring subscription
    for (const order of orders || []) {
      try {
        const expirationDate = new Date(order.expires_at).toLocaleDateString();
        
        // Generate product list HTML
        let productsHtml = '';
        for (const item of order.order_items || []) {
          productsHtml += `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.products?.name || 'Product'}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
            </tr>
          `;
        }
        
        // Create email HTML
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Subscription Expiring Soon</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .container { border: 1px solid #ddd; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background-color: #f2f2f2; text-align: left; padding: 10px; }
              .button { display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your CloudApp Subscription</h1>
                <p>Your subscription is expiring soon.</p>
              </div>
              
              <div class="details">
                <p>Dear ${order.billing_name},</p>
                <p>This is a friendly reminder that your CloudApp subscription will expire on <strong>${expirationDate}</strong>.</p>
                <p>Here's a summary of your current subscription:</p>
                
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productsHtml}
                  </tbody>
                </table>
                
                <p>To ensure uninterrupted service, please renew your subscription before the expiration date.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://cloudapp.example.com/renew" class="button">Renew Subscription</a>
                </div>
              </div>
              
              <p style="font-size: 12px; color: #666; margin-top: 30px;">
                If you have any questions, please contact our support team at support@cloudapp.example.com.
              </p>
            </div>
          </body>
          </html>
        `;
        
        // Send email via Resend
        const { data: emailData } = await resend.emails.send({
          from: "CloudApp <onboarding@resend.dev>",
          to: order.billing_email,
          subject: "Your CloudApp subscription is expiring soon",
          html,
        });
        
        // Mark reminder as sent
        if (emailData) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({ reminder_sent: true })
            .eq('id', order.id);
            
          if (updateError) {
            console.error(`Failed to update order ${order.id}:`, updateError);
          } else {
            sentEmails.push({ id: order.id, email: order.billing_email });
          }
        }
      } catch (emailError) {
        console.error(`Failed to send reminder for order ${order.id}:`, emailError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sent ${sentEmails.length} expiration reminders`,
        sentEmails 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in subscription-reminder function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error}),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
