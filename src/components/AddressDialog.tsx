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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const CITY_OPTIONS = [
  { city: 'Bhilai', pincode: '490001' },
  { city: 'Durg', pincode: '491001' },
  { city: 'Raipur', pincode: '492001' },
  { city: 'Rajnandgaon', pincode: '491441' },
];

export const AddressDialog = ({ open, onOpenChange, onSave, address }: AddressDialogProps) => {
  const { user } = useAuth();
  const form = useForm({
    defaultValues: {
      type: address?.type || 'home',
      name: address?.name || '',
      phone: address?.phone ? address.phone.replace('+91', '') : '',
      address: address?.address || '',
      city: address?.city || '',
      state: 'Chhattisgarh',
      pincode: address?.pincode || '',
      isDefault: address?.isDefault || false,
    }
  });

  const onSubmit = (data: any) => {
    const phoneWithCountryCode = `+91${data.phone}`;
    const addressData = {
      ...data,
      phone: phoneWithCountryCode
    };
    
    // Log in the specified format
    console.log({
      firebase_uid: user?.uid || '',
      type:data.type,
      Phone_Number: phoneWithCountryCode,
      address: {
        street: data.address,
        city: data.city,
        state: data.state,
        zip: data.pincode,
        country: "India"
      }
    });
    
    onSave(addressData);
    form.reset();
    onOpenChange(false);
  };

  const handleCityChange = (selectedCity: string) => {
    const cityData = CITY_OPTIONS.find(option => option.city === selectedCity);
    if (cityData) {
      form.setValue('city', selectedCity);
      form.setValue('pincode', cityData.pincode);
    }
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
                        <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-700 font-medium">
                          +91
                        </span>
                        <Input 
                          {...field} 
                          placeholder="Enter 10-digit number"
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
                    <Select onValueChange={handleCityChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CITY_OPTIONS.map((option) => (
                          <SelectItem key={option.city} value={option.city}>
                            {option.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input {...field} value="Chhattisgarh" readOnly className="bg-gray-100" />
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
                      <Input {...field} readOnly className="bg-gray-100" />
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
