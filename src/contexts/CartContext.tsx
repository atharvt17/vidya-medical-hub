
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/lib/AuthProvider';

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
        const response = await fetch(`http://localhost:8000/api/cart/?userId=${user.uid}`);
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

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
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
