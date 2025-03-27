
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';
import { Product } from '@/types/supabase';

interface EditProductFormProps {
  productId: string;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

export const EditProductForm = ({ productId, onSuccess, onCancel }: EditProductFormProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(true);

  // Fetch the product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        
        setProduct(data);
        setName(data.name || '');
        setDescription(data.description || '');
        setShortDescription(data.short_description || '');
        setPrice(data.price?.toString() || '');
        setCategory(data.category_id || '');
        setImage(data.image || '');
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const numericPrice = parseFloat(price);
      
      if (isNaN(numericPrice)) {
        toast.error('Please enter a valid price');
        setIsLoading(false);
        return;
      }

      // Fix: Convert the Date object to an ISO string for the updated_at field
      const updates = {
        name,
        description,
        short_description: shortDescription,
        price: numericPrice,
        category_id: category,
        image,
        updated_at: new Date().toISOString() // Convert Date to string
      };

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Product updated successfully');
      onSuccess(data);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isProductLoading) {
    return (
      <DialogContent>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      </DialogContent>
    );
  }

  if (!product) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <div className="py-6">Product not found</div>
        <DialogFooter>
          <Button onClick={onCancel}>Close</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Product</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input 
            id="shortDescription" 
            value={shortDescription} 
            onChange={(e) => setShortDescription(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={4} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            type="number" 
            step="0.01" 
            min="0" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input 
            id="image" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
          />
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : 'Update Product'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
