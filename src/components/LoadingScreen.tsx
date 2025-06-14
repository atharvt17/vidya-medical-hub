
import { Loader2, Heart, ShoppingCart, Package } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">V</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vidya Medical</h1>
          <p className="text-gray-600">Trusted Healthcare</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          
          <div className="text-gray-600">
            <p className="mb-4">Loading your personalized experience...</p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Wishlist</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-green-500" />
                <span>Cart</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-500" />
                <span>Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
