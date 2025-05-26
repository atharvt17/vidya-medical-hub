
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Edit, Trash2, Home, Building, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthProvider";

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const SavedAddresses = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'John Doe',
      phone: '+91 9876543210',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'John Doe',
      phone: '+91 9876543210',
      address: '456 Business Park, Office 301',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false
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
          Loading addresses...
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'work':
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
              <p className="text-gray-600">Manage your delivery addresses</p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        {getAddressIcon(address.type)}
                        <span className="font-medium capitalize">{address.type}</span>
                      </div>
                      {address.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{address.name}</h3>
                    <p className="text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-gray-700 mb-2">{address.address}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {addresses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6">Add your first address to get started with deliveries</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SavedAddresses;
