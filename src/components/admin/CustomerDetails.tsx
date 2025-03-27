
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { RefreshCw, Mail, ShoppingBag } from 'lucide-react';

interface CustomerDetailsProps {
  customerId: string;
  onClose: () => void;
  onViewOrders: (customerId: string) => void;
  onSendEmail: (email: string) => void;
}

export const CustomerDetails = ({ 
  customerId, 
  onClose, 
  onViewOrders, 
  onSendEmail 
}: CustomerDetailsProps) => {
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        // Fetch customer profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', customerId)
          .single();

        if (profileError) throw profileError;

        // Fetch order count and total spent
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('user_id', customerId);

        if (ordersError) throw ordersError;

        setCustomer(profile);
        setOrderCount(orders?.length || 0);
        setTotalSpent(orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0);
      } catch (error) {
        console.error('Error fetching customer details:', error);
        toast.error('Failed to load customer details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  if (isLoading) {
    return (
      <DialogContent>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      </DialogContent>
    );
  }

  if (!customer) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <div className="py-6">Customer not found</div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Customer Details</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{customer.full_name || 'No Name Provided'}</h2>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => onSendEmail(customer.email)}
              className="flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
            <Button 
              size="sm" 
              onClick={() => onViewOrders(customer.id)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>View Orders</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Joined Date</h3>
            <p className="text-lg font-medium">
              {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
            <p className="text-lg font-medium">{orderCount}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
            <p className="text-lg font-medium">${totalSpent.toFixed(2)}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Last Order</h3>
            <p className="text-lg font-medium">
              {orderCount > 0 ? 'Fetch this in a future update' : 'No orders yet'}
            </p>
          </Card>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Customer Information</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd>{customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Full Name</dt>
              <dd>{customer.full_name || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Account Created</dt>
              <dd>{new Date(customer.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last Updated</dt>
              <dd>{new Date(customer.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
};
