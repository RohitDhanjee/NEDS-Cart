
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CreditCard, 
  CheckCircle2,
  User,
  Mail,
  Home,
  MapPin,
  Globe
} from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CartItem } from '@/pages/Cart'; // Import the CartItem type
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define checkout form schema
const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(3, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  // Calculate item total
  const calculateItemTotal = (item: CartItem) => {
    const featuresCost = item.selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
    return (item.product.price + featuresCost) * item.quantity;
  };
  
  // Calculate cart total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };
  
  // Fetch cart items from localStorage
  useEffect(() => {
    const getCartItems = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getCartItems();
  }, []);
  
  // Save order to Supabase
  const saveOrderToSupabase = async (formData: CheckoutFormValues) => {
    try {
      setIsSubmitting(true);
      const total = calculateTotal();
      
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return null;
      }
      
      // Create order record
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          billing_name: `${formData.firstName} ${formData.lastName}`,
          billing_email: formData.email,
          billing_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
          total_amount: total,
          payment_id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`, // In a real app, this would come from payment processor
          status: 'completed'
        })
        .select('id')
        .single();
      
      if (orderError) {
        throw new Error(`Error creating order: ${orderError.message}`);
      }
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: calculateItemTotal(item)
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        throw new Error(`Error creating order items: ${itemsError.message}`);
      }
      
      return orderData.id;
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error("Failed to process your order. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Complete order
  const completeOrder = async (formData: CheckoutFormValues) => {
    // Show processing state with toast
    toast.loading('Processing your order...');
    
    const orderId = await saveOrderToSupabase(formData);
    
    if (orderId) {
      // Set order ID for success page
      setOrderId(orderId);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      
      // Show success message
      toast.success('Payment successful!');
      
      // Show order complete page
      setOrderComplete(true);
    } else {
      toast.error('There was a problem processing your order');
    }
  };
  
  const onSubmit = (formData: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    completeOrder(formData);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32">
          <div className="container-tight py-16 text-center">
            <p>Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32">
        <div className="container-tight py-16">
          {!orderComplete ? (
            <>
              <div className="mb-10">
                <Button asChild variant="ghost" className="mb-4">
                  <Link to="/cart">
                    <ChevronLeft size={16} className="mr-2" />
                    Back to Cart
                  </Link>
                </Button>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">Checkout</h1>
                <p className="text-muted-foreground">Complete your purchase</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Billing Information */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                          <User size={20} className="mr-2" />
                          Billing Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your first name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Billing Address */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                          <Home size={20} className="mr-2" />
                          Billing Address
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-6">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your street address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your city" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State / Province</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your state" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP / Postal Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your ZIP code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your country" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Method */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                          <CreditCard size={20} className="mr-2" />
                          Payment Method
                        </h2>
                        
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                          <div className={`flex items-center space-x-3 border rounded-lg p-4 ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="flex-grow font-medium cursor-pointer">PayPal</Label>
                            <img src="https://cdn.cdnlogo.com/logos/p/9/paypal.svg" alt="PayPal" className="h-8" />
                          </div>
                          
                          <div className={`flex items-center space-x-3 border rounded-lg p-4 ${paymentMethod === 'creditCard' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <RadioGroupItem value="creditCard" id="creditCard" />
                            <Label htmlFor="creditCard" className="flex-grow font-medium cursor-pointer">Credit Card</Label>
                            <div className="flex space-x-2">
                              <img src="https://cdn.cdnlogo.com/logos/v/69/visa.svg" alt="Visa" className="h-6" />
                              <img src="https://cdn.cdnlogo.com/logos/m/33/mastercard.svg" alt="Mastercard" className="h-6" />
                            </div>
                          </div>
                        </RadioGroup>
                        
                        {paymentMethod === 'creditCard' && (
                          <div className="mt-6 space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="expDate">Expiration Date</Label>
                                <Input id="expDate" placeholder="MM/YY" />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                        
                        {isLoading ? (
                          <div className="text-center py-4">
                            <p>Loading cart items...</p>
                          </div>
                        ) : cartItems.length > 0 ? (
                          <div className="space-y-4 mb-6">
                            {cartItems.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="flex-grow">
                                  {item.product.name} {item.quantity > 1 && `(x${item.quantity})`}
                                </span>
                                <span className="font-medium ml-2">
                                  ${calculateItemTotal(item).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 mb-6">
                            <p>Your cart is empty</p>
                          </div>
                        )}
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-between font-bold text-lg mb-6">
                          <span>Total</span>
                          <span>${cartItems.length > 0 ? calculateTotal().toFixed(2) : "0.00"}/month</span>
                        </div>
                        
                        <Button 
                          type="submit"
                          className="w-full py-6 font-medium rounded-xl" 
                          size="lg"
                          disabled={cartItems.length === 0 || isSubmitting}
                        >
                          {isSubmitting ? 'Processing...' : 'Complete Order'}
                        </Button>
                        
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                          <p>By completing this order, you agree to our</p>
                          <div className="flex justify-center space-x-1">
                            <a href="#" className="text-primary hover:underline">Terms of Service</a>
                            <span>&</span>
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </>
          ) : (
            // Order Success Page
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. We've sent a confirmation email with your order details.
              </p>
              
              <div className="bg-secondary/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-bold mb-3">Order Information</h3>
                <p className="text-sm">Order #: <span className="font-medium">{orderId ? orderId.substring(0, 8).toUpperCase() : 'CLD-000000'}</span></p>
                <p className="text-sm">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                <p className="text-sm">Total: <span className="font-medium">${calculateTotal().toFixed(2)}/month</span></p>
              </div>
              
              <div className="space-x-4">
                <Button asChild>
                  <Link to="/">
                    Return to Home
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="#">
                    <Mail size={16} className="mr-2" />
                    View Receipt
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
