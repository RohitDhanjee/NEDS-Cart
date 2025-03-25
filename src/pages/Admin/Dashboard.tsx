
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
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

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
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
      loadDashboardData();
    };

    const loadDashboardData = async () => {
      try {
        // Get total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Get total orders
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Get recent orders
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            billing_name,
            total_amount,
            status
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setTotalProducts(productsCount || 0);
        setTotalOrders(ordersCount || 0);
        setRecentOrders(orders || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
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
                <SidebarMenuButton isActive={true} tooltip="Dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Products">
                  <a href="/admin/products">
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </a>
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
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Total Products</CardTitle>
                <CardDescription>All products in catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{totalProducts}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Total Orders</CardTitle>
                <CardDescription>All processed orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{totalOrders}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Revenue</CardTitle>
                <CardDescription>Total revenue from orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$0.00</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest 5 orders placed on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Order ID</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Customer</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50">
                          <td className="py-2">{order.id.slice(0, 8)}</td>
                          <td className="py-2">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-2">{order.billing_name}</td>
                          <td className="py-2">${order.total_amount}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No recent orders found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
