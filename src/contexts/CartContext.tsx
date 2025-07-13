
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/lib/AuthProvider';
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
  prescription: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart data from API when user is authenticated
  useEffect(() => {
    const fetchCartData = async () => {
      if (!user?.uid) {
        setCartItems([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://44.210.140.152:8000/api/cart/?userId=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched cart data:', data);
          
          // Transform API data to match CartItem interface
          const transformedItems: CartItem[] = data.items?.map((item: any) => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image_url,
            brand: item.manufacturer,
            prescription: item.requires_prescription,
          })) || [];
          
          setCartItems(transformedItems);
        } else {
          console.error('Failed to fetch cart data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [user?.uid]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1 || !user?.uid) return;

    // Store previous state for rollback
    const previousItems = [...cartItems];
    
    // Optimistic update - update UI immediately
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    try {
      const response = await fetch('http://44.210.140.152:8000/api/cart/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          items: [
            {
              product_id: id,
              quantity: quantity
            }
          ]
        }),
      });

      if (!response.ok) {
        // Rollback on failure
        setCartItems(previousItems);
        console.error('Failed to update quantity:', response.status);
        toast.error('Failed to update quantity');
      }
    } catch (error) {
      // Rollback on error
      setCartItems(previousItems);
      console.error('Error updating quantity:', error);
      toast.error('Error updating quantity');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user?.uid) return;

    // Store previous state and item for rollback
    const previousItems = [...cartItems];
    const removedItem = cartItems.find(item => item.id === id);

    // Optimistic update - remove item immediately from UI
    setCartItems(prev => prev.filter(item => item.id !== id));

    try {
      const response = await fetch(`http://44.210.140.152:8000/api/cart/?userId=${user.uid}&product_id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (removedItem) {
          toast.success(`${removedItem.name} removed from cart.`);
        }
      } else {
        // Rollback on failure
        setCartItems(previousItems);
        console.error('Failed to remove item from cart:', response.status);
        toast.error('Failed to remove item from cart');
      }
    } catch (error) {
      // Rollback on error
      setCartItems(previousItems);
      toast.error('Error removing item from cart');
      console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user?.uid) return;

    // Store previous state for rollback
    const previousItems = [...cartItems];

    // Optimistic update - clear cart immediately
    setCartItems([]);

    try {
      const response = await fetch(`http://44.210.140.152:8000/api/cart/?userId=${user.uid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Cart cleared successfully');
      } else {
        // Rollback on failure
        setCartItems(previousItems);
        console.error('Failed to clear cart:', response.status);
        toast.error('Failed to clear cart');
      }
    } catch (error) {
      // Rollback on error
      setCartItems(previousItems);
      console.error('Error clearing cart:', error);
      toast.error('Error clearing cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};
