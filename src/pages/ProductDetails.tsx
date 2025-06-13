import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthProvider";
import { GET_PRODUCT_BY_ID } from "@/lib/queries/productDetails";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: id || "" },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Button onClick={() => navigate("/products")} className="mt-4">
            Back to Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const product = data.product;
  
  // Create a mock images array since the API only returns one imageUrl
  const images = [product.imageUrl, product.imageUrl, product.imageUrl];

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        brand: product.manufacturer,
        prescription: product.requiresPrescription,
      });
    }
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const wishlistProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.imageUrl,
      brand: product.manufacturer,
      rating: product.rating,
      prescription: product.requiresPrescription,
      inStock: true, // Assuming product details page shows in-stock items
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(wishlistProduct);
    }
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <span>Home</span> / <span>Products</span> / <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">{product.manufacturer}</span>
              {product.requiresPrescription && (
                <Badge variant="secondary">Prescription Required</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
              </div>
              <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                In Stock
              </span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice !== product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                size="lg"
                className={isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-600">On orders above ₹500</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-600">100% safe & secure</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-600">30 days return policy</p>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Dosage</h3>
                <p className="text-gray-600">{product.dosage}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Warnings</h3>
                <p className="text-gray-600">{product.warnings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
