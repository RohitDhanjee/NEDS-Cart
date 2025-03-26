
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  RefreshCw, 
  Award,
  ShoppingCart
} from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Feature, ProductCategory } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product as SupabaseProduct } from '@/types/supabase';
import { CartItem } from './Cart';

interface ProductFeature {
  id: string;
  name: string;
  description: string;
  price: number;
}

const Product = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<ProductFeature[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const dummyFeatures: ProductFeature[] = [
    {
      id: 'feature-1',
      name: 'Premium Support',
      description: '24/7 priority support with dedicated account manager',
      price: 29.99
    },
    {
      id: 'feature-2',
      name: 'Additional Storage',
      description: 'Increase your storage capacity by 500GB',
      price: 19.99
    },
    {
      id: 'feature-3',
      name: 'Advanced Analytics',
      description: 'Detailed insights and reporting capabilities',
      price: 24.99
    }
  ];
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProduct(data);
          setTotalPrice(data.price);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  useEffect(() => {
    if (product) {
      const featuresPrice = selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
      const newTotal = (product.price + featuresPrice) * quantity;
      setTotalPrice(newTotal);
    }
  }, [product, selectedFeatures, quantity]);
  
  const toggleFeature = (feature: ProductFeature) => {
    if (selectedFeatures.some(f => f.id === feature.id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f.id !== feature.id));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  const changeQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const addToCart = () => {
    if (product) {
      // Fix: Cast category_id to ProductCategory type using type assertion
      // This assumes that category_id values match the expected ProductCategory values
      const categoryAsProductCategory = product.category_id as ProductCategory;
      
      const cartProductFormat = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        shortDescription: product.short_description || '',
        price: product.price,
        image: product.image || '/placeholder.svg',
        category: categoryAsProductCategory,
        features: [],
      };
      
      const cartItem: CartItem = {
        product: cartProductFormat,
        selectedFeatures: selectedFeatures.map(f => ({
          id: f.id,
          name: f.name,
          description: f.description,
          price: f.price
        })),
        quantity: quantity
      };
      
      let currentCart: CartItem[] = [];
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          currentCart = JSON.parse(storedCart);
        }
      } catch (error) {
        console.error('Error reading cart from localStorage:', error);
      }
      
      const existingItemIndex = currentCart.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedFeatures) === JSON.stringify(cartItem.selectedFeatures)
      );
      
      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push(cartItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      toast.success('Product added to cart!', {
        description: `${product.name} has been added to your cart.`,
      });
      
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 container-tight">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 container-tight">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Product not found</h1>
          <p className="mt-4">The requested product does not exist.</p>
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
          <Button variant="ghost" asChild className="mb-8">
            <Link to={`/products/${product.category_id}`}>
              <ArrowLeft size={16} className="mr-2" />
              Back to {product.category_id} apps
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white p-8 rounded-2xl shadow-sm overflow-hidden">
              <img 
                src={product.image || '/placeholder.svg'} 
                alt={product.name} 
                className="w-full h-96 object-cover object-center rounded-xl"
              />
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Shield size={20} className="text-primary" />
                  </div>
                  <p className="text-sm font-medium">Secure</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <RefreshCw size={20} className="text-primary" />
                  </div>
                  <p className="text-sm font-medium">30-Day Guarantee</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Award size={20} className="text-primary" />
                  </div>
                  <p className="text-sm font-medium">Premium Quality</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  {product.category_id.charAt(0).toUpperCase() + product.category_id.slice(1)}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-muted-foreground">{product.description || product.short_description}</p>
              </div>
              
              <div className="py-4 border-t border-b border-border">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Base price, customize below</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Customize Your Plan</h3>
                <div className="space-y-4">
                  {dummyFeatures.map((feature) => (
                    <div 
                      key={feature.id} 
                      className="flex items-start p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <Checkbox 
                        id={feature.id}
                        checked={selectedFeatures.some(f => f.id === feature.id)}
                        onCheckedChange={() => toggleFeature(feature)}
                        className="mt-1"
                      />
                      <div className="ml-4 flex-grow">
                        <label 
                          htmlFor={feature.id} 
                          className="font-medium cursor-pointer flex justify-between"
                        >
                          <span>{feature.name}</span>
                          <span>${feature.price.toFixed(2)}/mo</span>
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Quantity</h3>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => changeQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => changeQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="bg-secondary/30 p-6 rounded-xl">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Base price:</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                
                {selectedFeatures.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <span className="font-medium">Selected features:</span>
                    {selectedFeatures.map((feature) => (
                      <div key={feature.id} className="flex justify-between text-sm pl-4">
                        <span>{feature.name}</span>
                        <span>${feature.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {quantity > 1 && (
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Quantity:</span>
                    <span>x{quantity}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}/month</span>
                  </div>
                </div>
                
                <Button onClick={addToCart} className="w-full py-6 font-medium rounded-xl" size="lg">
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
