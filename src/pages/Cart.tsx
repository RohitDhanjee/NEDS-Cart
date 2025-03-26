
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Product, Feature } from '@/lib/data';

// Define CartItem type
export type CartItem = {
  product: Product;
  selectedFeatures: Feature[];
  quantity: number;
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);
  
  // Calculate item total
  const calculateItemTotal = (item: CartItem) => {
    const featuresCost = item.selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
    return (item.product.price + featuresCost) * item.quantity;
  };
  
  // Calculate cart total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };
  
  // Update quantity
  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cartItems];
    newCart[itemIndex].quantity = newQuantity;
    setCartItems(newCart);
  };
  
  // Remove item
  const removeItem = (itemIndex: number) => {
    const newCart = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(newCart);
  };
  
  // Proceed to checkout
  const proceedToCheckout = () => {
    navigate('/checkout');
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center">
            <ShoppingCart className="mr-3" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground mb-10">Review your items before proceeding to checkout</p>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 bg-secondary rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <h3 className="text-lg font-bold mb-1 sm:mb-0">{item.product.name}</h3>
                          <span className="font-bold">${item.product.price.toFixed(2)}/mo</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{item.product.shortDescription}</p>
                        
                        {/* Selected Features */}
                        {item.selectedFeatures.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Selected Features:</p>
                            <ul className="text-sm space-y-1">
                              {item.selectedFeatures.map((feature) => (
                                <li key={feature.id} className="flex justify-between">
                                  <span>{feature.name}</span>
                                  <span>${feature.price.toFixed(2)}/mo</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium mr-2">Qty:</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="w-8 h-8"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <ChevronLeft size={16} />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="w-8 h-8"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                            >
                              <ChevronRight size={16} />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center">
                  <Button asChild variant="outline">
                    <Link to="/">
                      <ChevronLeft size={16} className="mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} {item.quantity > 1 && `(x${item.quantity})`}
                        </span>
                        <span>${calculateItemTotal(item).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}/month</span>
                  </div>
                  
                  <Button 
                    className="w-full py-6 font-medium rounded-xl" 
                    size="lg"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                  
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Secure checkout with PayPal</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={28} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any cloud applications to your cart yet.
              </p>
              <Button asChild>
                <Link to="/">
                  Browse Applications
                </Link>
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
