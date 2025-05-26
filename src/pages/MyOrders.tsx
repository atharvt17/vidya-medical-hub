
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthProvider";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  total: number;
  items: OrderItem[];
  address: string;
}

const MyOrders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'VM2024001',
      date: '2024-01-15',
      status: 'delivered',
      total: 245,
      items: [
        {
          id: 1,
          name: 'Paracetamol 500mg Tablets',
          price: 45,
          quantity: 2,
          image: '/placeholder.svg'
        },
        {
          id: 2,
          name: 'Vitamin D3 Supplements',
          price: 155,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      address: '123 Main Street, Mumbai, Maharashtra - 400001'
    },
    {
      id: '2',
      orderNumber: 'VM2024002',
      date: '2024-01-20',
      status: 'shipped',
      total: 89,
      items: [
        {
          id: 3,
          name: 'Antiseptic Cream',
          price: 89,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      address: '456 Business Park, Mumbai, Maharashtra - 400002'
    }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-10 text-gray-500">
          Loading orders...
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(order.status)} mb-2`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </Badge>
                    <p className="text-lg font-bold">₹{order.total}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Delivery Address */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Delivery Address</h4>
                    <p className="text-gray-600">{order.address}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <Button variant="outline" size="sm">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;
