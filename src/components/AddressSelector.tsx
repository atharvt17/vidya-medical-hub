
import { useState, useEffect } from "react";
import { MapPin, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddressDialog } from "./AddressDialog";
import { useAuth } from "@/lib/AuthProvider";
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
}

interface AddressSelectorProps {
  onAddressSelect: (address: Address | null) => void;
}

export const AddressSelector = ({ onAddressSelect }: AddressSelectorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  useEffect(() => {
    onAddressSelect(selectedAddress);
  }, [selectedAddress, onAddressSelect]);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/get-addresses?firebase_uid=${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      const fetchedAddresses = data.addresses || [];
      setAddresses(fetchedAddresses);
      
      // Set default address as selected
      const defaultAddress = fetchedAddresses.find((addr: Address) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch addresses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (addressData: any) => {
    if (!user) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/add-address/', {
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

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressList(false);
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedAddress ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="font-medium capitalize">{selectedAddress.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{selectedAddress.name}</h3>
                <p className="text-gray-600 mb-1">{selectedAddress.phone}</p>
                <p className="text-gray-700 mb-1">{selectedAddress.street}</p>
                <p className="text-gray-600">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddressList(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No address selected</h3>
            <p className="text-gray-600 mb-4">Please add or select a delivery address</p>
            <Button onClick={() => setAddressDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </CardContent>
        </Card>
      )}

      {showAddressList && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Select Address</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddressDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
            <div className="space-y-2">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddress?._id === address._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium capitalize text-sm">{address.type}</span>
                    {address.is_default && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                    )}
                  </div>
                  <p className="font-medium text-sm">{address.name}</p>
                  <p className="text-gray-600 text-sm">{address.street}, {address.city}</p>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddressList(false)}
              className="mt-3 w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSave={handleSaveAddress}
      />
    </div>
  );
};