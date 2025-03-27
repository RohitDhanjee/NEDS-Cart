
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ShoppingBag, Eye } from 'lucide-react';

const orderStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface CustomerOrdersProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
  onViewOrder: (orderId: string) => void;
}

export const CustomerOrders = ({ 
  customerId, 
  customerName, 
  onClose, 
  onViewOrder 
}: CustomerOrdersProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
        toast.error('Failed to load customer orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [customerId]);

  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Orders for {customerName || 'Customer'}</DialogTitle>
      </DialogHeader>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : orders.length > 0 ? (
        <div className="overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={orderStatusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewOrder(order.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye size={14} />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ShoppingBag size={48} className="mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            This customer hasn't placed any orders yet
          </p>
        </div>
      )}
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
};
