import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/lib/AuthProvider';
import { toast } from 'sonner';
import { apolloClient } from '@/lib/apolloClient';
import { GET_WISHLIST_PRODUCT } from '@/lib/queries/wishlistProduct';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  rating: number;
  prescription: boolean;
  inStock: boolean;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // Helper function to fetch product details by ID using GraphQL
  const fetchProductDetails = async (productId: string): Promise<WishlistItem | null> => {
    try {
      console.log('Fetching product details for ID:', productId);
      const { data } = await apolloClient.query({
        query: GET_WISHLIST_PRODUCT,
        variables: { id: productId },
      });

      if (data?.product) {
        const product = data.product;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.imageUrl,
          brand: product.manufacturer,
          rating: product.rating || 0,
          prescription: product.requiresPrescription,
          inStock: true // We'll assume in stock since we don't have this field in the GraphQL query
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product details with GraphQL:', error);
      return null;
    }
  };

  const fetchWishlist = async () => {
    if (!user || authLoading) return;
    
    setLoading(true);
    try {
      console.log('Fetching wishlist for user:', user.uid);
      const response = await fetch(`http://localhost:8000/api/wishlist/?userId=${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Wishlist data received:', data);
        
        // Extract product IDs from the nested structure
        const productIds = data.wishlist?.items?.map((item: { productId: string }) => item.productId) || [];
        console.log('Product IDs from wishlist:', productIds);
        
        // Fetch full product details for each product ID
        const productPromises = productIds.map((productId: string) => fetchProductDetails(productId));
        const products = await Promise.all(productPromises);
        
        // Filter out any null results and set the wishlist items
        const validProducts = products.filter((product): product is WishlistItem => product !== null);
        console.log('Fetched product details:', validProducts);
        setWishlistItems(validProducts);
      } else {
        console.error('Failed to fetch wishlist:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: WishlistItem) => {
    if (!user) return;

    // Optimistic UI update - add immediately
    setWishlistItems(prev => [...prev, product]);
    toast.success(`${product.name} added to wishlist!`);

    try {
      const response = await fetch('http://localhost:8000/api/wishlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          productIds: [product.id]
        }),
      });

      if (!response.ok) {
        // Revert the optimistic update on failure
        setWishlistItems(prev => prev.filter(item => item.id !== product.id));
        toast.error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Revert the optimistic update on error
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    // Store the item for potential rollback
    const removedItem = wishlistItems.find(item => item.id === productId);
    
    // Optimistic UI update - remove immediately
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Product removed from wishlist!');

    try {
      const response = await fetch('http://localhost:8000/api/wishlist/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          productId: productId
        }),
      });

      if (!response.ok) {
        // Revert the optimistic update on failure
        if (removedItem) {
          setWishlistItems(prev => [...prev, removedItem]);
        }
        toast.error('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Revert the optimistic update on error
      if (removedItem) {
        setWishlistItems(prev => [...prev, removedItem]);
      }
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Only fetch wishlist when user is authenticated and auth loading is complete
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User authenticated, fetching wishlist...');
      fetchWishlist();
    } else if (!authLoading && !user) {
      console.log('User not authenticated, clearing wishlist...');
      setWishlistItems([]);
    }
  }, [user, authLoading]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      loading,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
