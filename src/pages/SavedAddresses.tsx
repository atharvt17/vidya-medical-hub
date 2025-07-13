import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Edit, Trash2, Home, Building, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthProvider";
import { AddressDialog } from "@/components/AddressDialog";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useToast } from "@/hooks/use-toast";

interface Address {
  _id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

const SavedAddresses = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setLoadingAddresses(true);
      const response = await fetch(`http://44.210.140.152:8000/api/addresses?firebase_uid=${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch addresses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAddresses(false);
    }
  };

  if (loading || loadingAddresses) {
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

  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressDialogOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddressToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAddress = async () => {
  if (addressToDelete && user) {
    try {
      const response = await fetch('http://44.210.140.152:8000/api/delete-address/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          address_id: addressToDelete
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      // Refetch updated address list
      await fetchAddresses();

      toast({
        title: "Address deleted",
        description: "Address has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  }

  setDeleteDialogOpen(false);
  setAddressToDelete(null);
};


  const handleSaveAddress = async (addressData: any) => {
    if (!user) return;

    try {
      if (editingAddress) {
        // Edit existing address
        const response = await fetch('http://44.210.140.152:8000/api/edit-address/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebase_uid: user.uid,
            address_id: editingAddress._id,
            type: addressData.type,
            name: addressData.name,
            Phone_Number: addressData.phone,
            address: {
              street: addressData.address,
              city: addressData.city,
              state: addressData.state,
              zip: addressData.pincode,
              country: "India"
            }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update address');
        }

        toast({
          title: "Address updated",
          description: "Address has been successfully updated.",
        });
      } else {
        // Add new address
        const response = await fetch('http://44.210.140.152:8000/api/add-address/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebase_uid: user.uid,
            name: addressData.name,
            Phone_Number: addressData.phone,
            type: addressData.type,
            address: {
              street: addressData.address,
              city: addressData.city,
              state: addressData.state,
              zip: addressData.pincode,
              country: "India"
            }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add address');
        }

        toast({
          title: "Address added",
          description: "New address has been successfully added.",
        });
      }

      // Refresh addresses
      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch('http://44.210.140.152:8000/api/set-default-address/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          address_id: id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      // Update local state
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_default: addr._id === id
      })));

      toast({
        title: "Default address updated",
        description: "Default address has been changed.",
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Error",
        description: "Failed to set default address. Please try again.",
        variant: "destructive",
      });
    }
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
          <Button onClick={handleAddAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        {getAddressIcon(address.type)}
                        <span className="font-medium capitalize">{address.type}</span>
                      </div>
                      {address.is_default && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{address.name || 'Address'}</h3>
                    <p className="text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-gray-700 mb-2">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.zip}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    {!address.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address._id)}
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
              <Button onClick={handleAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSave={handleSaveAddress}
        address={editingAddress}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteAddress}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
      />

      <Footer />
    </div>
  );
};

export default SavedAddresses;