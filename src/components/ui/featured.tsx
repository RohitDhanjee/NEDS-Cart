
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/supabase';

const ProductCard = ({ product, index }: { product: Product, index: number }) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group hover-scale bg-white",
      "animate-fade-in opacity-0",
      { 'animation-delay-100': index === 0 },
      { 'animation-delay-200': index === 1 },
      { 'animation-delay-300': index === 2 },
      { 'animation-delay-400': index === 3 },
    )}>
      <div className="h-48 bg-secondary relative overflow-hidden">
        <img 
          src={product.image || '/placeholder.svg'} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs uppercase font-bold py-1 px-3 rounded-full">
          {product.category_id}
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {product.short_description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">
            ${parseFloat(product.price.toString()).toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-full p-0 w-10 h-10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
          >
            <Link to={`/product/${product.id}`}>
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .limit(4);
          
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
  return (
    <section className="py-20">
      <div className="container-tight">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="section-title">Featured Cloud Apps</h2>
          <p className="section-subtitle">Discover our most popular cloud applications trusted by thousands of professionals</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products found</p>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/products/gaming">
              View All Products
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Featured;
