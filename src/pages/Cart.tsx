
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/ui/navbar.tsx';
import Footer from '../components/ui/footer.tsx';
import { Button } from '../components/ui/button.tsx';
import { Product, Feature, ProductCategory } from '../lib/data.ts';
import { toast } from '../hooks/use-toast.ts';
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Update the CartItem interface to include the variation
export interface CartItem {
  product: Product;
  selectedFeatures: Feature[];
  selectedVariation?: {
    id: string;
    duration: string;
    price_modifier: number;
  };
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error reading cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your cart. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (index: number) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    updateCart(newCart);
    toast({
      title: "Item removed",
      description: "Item removed from cart"
    });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cartItems];
    newCart[index].quantity = newQuantity;
    updateCart(newCart);
  };

  const calculateItemTotal = (item: CartItem) => {
    // Get base product price with variation multiplier
    const basePrice = item.product.price * (item.selectedVariation?.price_modifier || 1);
    
    // Add all selected features
    const featuresPrice = item.selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
    
    // Multiply by quantity
    return (basePrice + featuresPrice) * item.quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty"
      });
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 container-tight">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading cart...</p>
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
        <div className="container-tight py-12">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32 bg-secondary">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="p-4 flex-grow">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{item.product.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{item.product.shortDescription}</p>
                              
                              {/* Display variation if present */}
                              {item.selectedVariation && (
                                <div className="mt-1">
                                  <span className="text-sm font-medium">Duration: </span>
                                  <span className="text-sm">{item.selectedVariation.duration}</span>
                                </div>
                              )}
                              
                              {/* Display selected features */}
                              {item.selectedFeatures.length > 0 && (
                                <div className="mt-1">
                                  <span className="text-sm font-medium">Features: </span>
                                  <span className="text-sm">
                                    {item.selectedFeatures.map(f => f.name).join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 sm:mt-0 flex sm:flex-col items-start sm:items-end justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(index, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(index, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                              <div className="flex space-x-4 items-center">
                                <span className="font-semibold">
                                  ${calculateItemTotal(item).toFixed(2)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(index)}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to="/">Continue Shopping</Link>
                  </Button>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full mb-4"
                    size="lg"
                  >
                    Checkout
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <ShieldCheck size={16} className="mr-2 text-primary" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center">
                      <RefreshCw size={16} className="mr-2 text-primary" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <ShoppingCart size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Look like you haven't added anything to your cart yet.</p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
