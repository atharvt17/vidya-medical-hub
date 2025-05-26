
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: OrderItem[];
  address: string;
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export const OrderDetailsDialog = ({ open, onOpenChange, order }: OrderDetailsDialogProps) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery Address */}
          <div>
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <p className="text-gray-700">{order.address}</p>
          </div>

          <Separator />

          {/* Order Total */}
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
