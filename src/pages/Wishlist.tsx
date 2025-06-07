
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/AuthProvider";
import { toast } from "sonner";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      prescription: product.prescription,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your wishlist</h1>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading your wishlist...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <span className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love to your wishlist!</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{product.brand}</span>
                      <div className="flex items-center space-x-2">
                        {product.prescription && (
                          <Badge variant="secondary" className="text-xs">
                            Rx
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full mt-3"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
