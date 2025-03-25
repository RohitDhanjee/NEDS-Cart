
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  ShoppingCart, 
  Shield, 
  RefreshCw, 
  Award
} from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { getProductById, Feature, Product as ProductType } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const Product = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Find the product by ID
  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Initialize price
        setTotalPrice(foundProduct.price);
      }
    }
  }, [productId]);
  
  // Update total price when selections change
  useEffect(() => {
    if (product) {
      const featuresPrice = selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
      const newTotal = (product.price + featuresPrice) * quantity;
      setTotalPrice(newTotal);
    }
  }, [product, selectedFeatures, quantity]);
  
  // Toggle a feature selection
  const toggleFeature = (feature: Feature) => {
    if (selectedFeatures.some(f => f.id === feature.id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f.id !== feature.id));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  // Handle quantity changes
  const changeQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  // Add to cart
  const addToCart = () => {
    if (product) {
      toast.success('Product added to cart!', {
        description: `${product.name} has been added to your cart.`,
      });
      // In a real app, we would store this in a cart context or state
      // For now, let's just navigate to the cart page
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    }
  };
  
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
            <Link to={`/products/${product.category}`}>
              <ArrowLeft size={16} className="mr-2" />
              Back to {product.category} apps
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="bg-white p-8 rounded-2xl shadow-sm overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-96 object-cover object-center rounded-xl"
              />
              
              {/* Trust badges */}
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
            
            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              <div className="py-4 border-t border-b border-border">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Base price, customize below</p>
              </div>
              
              {/* Feature Selection */}
              <div>
                <h3 className="text-lg font-bold mb-4">Customize Your Plan</h3>
                <div className="space-y-4">
                  {product.features.map((feature) => (
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
              
              {/* Quantity */}
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
              
              {/* Total and Add to Cart */}
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
