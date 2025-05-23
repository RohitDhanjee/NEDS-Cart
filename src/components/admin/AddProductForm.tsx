import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const featureSchema = z.object({
  name: z.string().min(1, 'Feature name is required'),
  description: z.string().min(1, 'Feature description is required'),
  price: z.coerce.number().nonnegative('Price must be positive'),
});

const variationSchema = z.object({
  duration: z.string().min(1, 'Duration is required'),
  price_modifier: z.coerce.number().positive('Price modifier must be positive'),
});

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  price: z.coerce.number()
    .nonnegative('Price must be positive')
    .max(9999.99, 'Price must be less than 10,000'),
  image: z.string().optional(),
  features: z.array(featureSchema),
  variations: z.array(variationSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface AddProductFormProps {
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

export function AddProductForm({ onSuccess, onCancel }: AddProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      short_description: '',
      category_id: '',
      price: 0,
      image: '',
      features: [{ name: '', description: '', price: 0 }],
      variations: [{ duration: 'Monthly', price_modifier: 1.0 }],
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const { fields: variationFields, append: appendVariation, remove: removeVariation } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // First, insert the product
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description || null,
          short_description: data.short_description || null,
          category_id: data.category_id,
          price: data.price,
          image: data.image || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Then, insert the features
      if (data.features.length > 0) {
        const featuresData = data.features.map(feature => ({
          product_id: newProduct.id,
          name: feature.name,
          description: feature.description,
          price: feature.price,
        }));
        
        const { error: featuresError } = await supabase
          .from('product_features')
          .insert(featuresData);
        
        if (featuresError) throw featuresError;
      }
      
      // Finally, insert the variations
      if (data.variations.length > 0) {
        const variationsData = data.variations.map(variation => ({
          product_id: newProduct.id,
          duration: variation.duration,
          price_modifier: variation.price_modifier,
        }));
        
        const { error: variationsError } = await supabase
          .from('product_variations')
          .insert(variationsData);
        
        if (variationsError) throw variationsError;
      }
      
      onSuccess(newProduct as Product);
      toast({
        title: "Success",
        description: "Product added successfully"
      });
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add product: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[650px] p-0">
      <DialogHeader className="px-6 pt-6">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogDescription>
          Fill in the details below to create a new product.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="max-h-[70vh] px-6 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01"
                        min="0"
                        max="9999.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed product description" 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Variations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Subscription Durations</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => appendVariation({ duration: '', price_modifier: 1.0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Duration
                </Button>
              </div>
              
              {variationFields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`variations.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Monthly, Yearly" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variations.${index}.price_modifier`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Modifier</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  min="0.1"
                                  placeholder="1.0"
                                  {...field} 
                                />
                              </FormControl>
                              {variationFields.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeVariation(index)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Product Features */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Product Features</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => appendFeature({ name: '', description: '', price: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
              
              {featureFields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`features.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feature Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Feature name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`features.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name={`features.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <div className="flex items-start gap-2">
                              <FormControl className="flex-grow">
                                <Input placeholder="Feature description" {...field} />
                              </FormControl>
                              {featureFields.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeFeature(index)}
                                  className="text-destructive mt-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </form>
        </Form>
      </ScrollArea>

      <DialogFooter className="px-6 py-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
