
import React, { useState } from 'react';
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

// Mock order summary data
const mockOrderSummary = {
  subtotal: 44.97,
  total: 44.97
};

const Checkout = () => {
  const navigate = useNavigate();
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  
  // Simulate order completion
  const completeOrder = () => {
    // Show processing state with toast
    toast.loading('Processing your order...');
    
    // Simulate API call delay
    setTimeout(() => {
      setOrderComplete(true);
      toast.success('Payment successful!');
    }, 2000);
  };
  
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
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Billing Address */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                      <Home size={20} className="mr-2" />
                      Billing Address
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="Enter your street address" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Enter your city" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="state">State / Province</Label>
                          <Input id="state" placeholder="Enter your state" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP / Postal Code</Label>
                          <Input id="zip" placeholder="Enter your ZIP code" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" placeholder="Enter your country" />
                        </div>
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
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${mockOrderSummary.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between font-bold text-lg mb-6">
                      <span>Total</span>
                      <span>${mockOrderSummary.total.toFixed(2)}/month</span>
                    </div>
                    
                    <Button 
                      className="w-full py-6 font-medium rounded-xl" 
                      size="lg"
                      onClick={completeOrder}
                    >
                      Complete Order
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
                <p className="text-sm">Order #: <span className="font-medium">CLD-{Math.floor(100000 + Math.random() * 900000)}</span></p>
                <p className="text-sm">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                <p className="text-sm">Total: <span className="font-medium">${mockOrderSummary.total.toFixed(2)}/month</span></p>
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
