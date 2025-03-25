
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { categories, Category } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/supabase';

const Products = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the category by ID
  useEffect(() => {
    if (categoryId) {
      const foundCategory = categories.find(c => c.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
      }
    }
  }, [categoryId]);
  
  // Get products for this category from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryId]);
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 container-tight">
          <h1 className="text-3xl font-bold">Category not found</h1>
          <p className="mt-4">The requested category does not exist.</p>
          <Button asChild className="mt-8">
            <Link to="/">Return Home</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32">
        {/* Header */}
        <section className="bg-secondary/50 py-20 mb-12">
          <div className="container-tight">
            <h1 className="section-title text-center">{category.name} Cloud Applications</h1>
            <p className="section-subtitle text-center mx-auto">
              {category.description}. Browse our selection of premium cloud applications.
            </p>
          </div>
        </section>
        
        {/* Products Grid */}
        <section className="container-tight pb-20">
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover-scale bg-white animate-fade-in">
                  <div className="h-48 bg-secondary relative overflow-hidden">
                    <img 
                      src={product.image || '/placeholder.svg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {product.short_description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        ${product.price.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full"
                      >
                        <Link to={`/product/${product.id}`}>
                          View Details
                          <ArrowRight size={16} className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">There are no products available in this category yet.</p>
              <Button asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
