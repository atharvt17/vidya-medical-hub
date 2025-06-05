import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Home, Building, MapPin } from "lucide-react";
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

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Omit<Address, 'id'>) => void;
  address?: Address;
}

export const AddressDialog = ({ open, onOpenChange, onSave, address }: AddressDialogProps) => {
  const { user } = useAuth();
  
  // Extract phone number without +91 prefix for editing
  const getPhoneWithoutPrefix = (phone: string) => {
    if (!phone) return '';
    return phone.startsWith('+91') ? phone.slice(3) : phone;
  };

  const form = useForm({
    defaultValues: {
      type: address?.type || 'home',
      name: address?.name || '',
      phone: getPhoneWithoutPrefix(address?.phone || ''),
      address: address?.address || '',
      city: address?.city || '',
      state: address?.state || '',
      pincode: address?.pincode || '',
      isDefault: address?.isDefault || false,
    }
  });

  const onSubmit = (data: any) => {
    // Add +91 prefix to phone number before saving
    const formattedData = {
      ...data,
      phone: data.phone ? `+91${data.phone}` : ''
    };

    // Log in the requested format
    const logData = {
      firebase_uid: user?.uid || '',
      Phone_Number: `+91${data.phone}`,
      address: {
        street: data.address,
        city: data.city,
        state: data.state,
        zip: data.pincode,
        country: "USA"
      }
    };
    console.log('Address data:', logData);

    onSave(formattedData);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {address ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Type</FormLabel>
                  <div className="flex space-x-2">
                    {['home', 'work', 'other'].map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={field.value === type ? 'default' : 'outline'}
                        onClick={() => field.onChange(type)}
                        className="flex items-center space-x-2"
                      >
                        {type === 'home' && <Home className="h-4 w-4" />}
                        {type === 'work' && <Building className="h-4 w-4" />}
                        {type === 'other' && <MapPin className="h-4 w-4" />}
                        <span className="capitalize">{type}</span>
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                          +91
                        </span>
                        <Input 
                          {...field} 
                          placeholder="9876543210"
                          className="rounded-l-none"
                          maxLength={10}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="House/Flat/Building No., Street" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {address ? 'Update Address' : 'Save Address'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
