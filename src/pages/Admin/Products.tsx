
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package as PackageIcon, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { AddProductForm } from '@/components/admin/AddProductForm';
import { EditProductForm } from '@/components/admin/EditProductForm';
import { Product } from '@/types/supabase';

const AdminProducts = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Check if user has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        toast.error('Unauthorized access');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      loadProducts();
    };

    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAddProductSuccess = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setAddProductOpen(false);
    toast.success('Product added successfully');
  };
  
  const handleEditProductSuccess = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setEditProductOpen(false);
    toast.success('Product updated successfully');
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setAddProductOpen(true);
  };

  const handleEditProduct = (id: string) => {
    setSelectedProductId(id);
    setEditProductOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: !product.is_featured })
        .eq('id', product.id);
      
      if (error) throw error;
      
      // Update local state
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, is_featured: !p.is_featured } : p
      ));
      
      toast.success(`Product ${product.is_featured ? 'removed from' : 'added to'} featured items`);
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2">
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <a href="/admin/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true} tooltip="Products">
                  <PackageIcon className="h-4 w-4" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <a href="/admin/orders">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Orders</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Customers">
                  <a href="/admin/customers">
                    <Users className="h-4 w-4" />
                    <span>Customers</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <a href="/admin/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Products Management</h1>
            <Button onClick={handleAddProduct} className="flex items-center gap-2">
              <Plus size={16} />
              Add Product
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Product Search</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by name or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category_id}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleToggleFeatured(product)}
                              className="p-0 h-auto"
                            >
                              {product.is_featured ? (
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                              ) : (
                                <Star className="h-5 w-5 text-gray-200" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditProduct(product.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil size={14} />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 size={14} />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package size={48} className="mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try a different search term' : 'Add your first product to get started'}
                  </p>
                  <Button onClick={handleAddProduct}>
                    <Plus size={16} className="mr-2" />
                    Add Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
            <AddProductForm onSuccess={handleAddProductSuccess} onCancel={() => setAddProductOpen(false)} />
          </Dialog>
          
          <Dialog open={editProductOpen} onOpenChange={setEditProductOpen}>
            {selectedProductId && (
              <EditProductForm 
                productId={selectedProductId}
                onSuccess={handleEditProductSuccess} 
                onCancel={() => setEditProductOpen(false)} 
              />
            )}
          </Dialog>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminProducts;
