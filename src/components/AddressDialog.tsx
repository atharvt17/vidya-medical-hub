import { useEffect } from "react";
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

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: any) => void;
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
    mode: "onBlur",
    defaultValues: {
      type: 'home',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: 'Chhattisgarh',
      pincode: '',
      isDefault: false,
    }
  });

  // When editing, populate fields
  useEffect(() => {
    if (address && open) {
      form.reset({
        type: address.type,
        name: address.name,
        phone: address.phone?.replace('+91', ''),
        address: address.street,
        city: address.city,
        state: 'Chhattisgarh',
        pincode: address.zip,
        isDefault: address.is_default,
      });
    } else if (open) {
      // Reset form when opening for a new address
      form.reset({
        type: 'home',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: 'Chhattisgarh',
        pincode: '',
        isDefault: false,
      });
    }
  }, [address, open, form]);

  const onSubmit = (data: any) => {
    const phoneWithCountryCode = `+91${data.phone}`;
    const addressData = {
      ...data,
      phone: phoneWithCountryCode
    };

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
          <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Address Type */}
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

            {/* Name and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Full name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit number",
                  },
                }}
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
                          placeholder="10-digit number"
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

            {/* Street Address */}
            <FormField
              control={form.control}
              name="address"
              rules={{ required: "Street address is required" }}
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

            {/* City, State, Pincode */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                rules={{ required: "City is required" }}
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

            {/* Actions */}
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