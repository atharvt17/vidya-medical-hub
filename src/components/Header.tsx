import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/AuthProvider";
import SearchCommand from "./SearchCommand";

const Header = () => {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const isProfileRelatedPage = location.pathname === '/saved-addresses' || location.pathname === '/my-orders';

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              {isHomePage ? (
                <>
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Vidya Medical</h1>
                    <p className="text-xs text-gray-500">Trusted Healthcare</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold text-gray-900">Vidya Medical</h1>
                  </div>
                </>
              )}
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search medicines, healthcare products..."
                  className="pl-10 w-full cursor-pointer"
                  onClick={() => setSearchOpen(true)}
                  readOnly
                />
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link to="/wishlist">
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <Heart className="h-5 w-5 mr-2" />
                      Wishlist
                    </Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="ghost" size="sm" className="relative">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleProfileClick}>
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleSignIn}>
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Menu - Only show on home page */}
          {isHomePage && (
            <nav className="hidden md:flex items-center space-x-12 py-3 border-t">
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                All Products
              </Link>
              <Link
                to="/upload-prescription"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Prescription
              </Link>
              <Link
                to="/products?category=supplements"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Supplements
              </Link>
              <Link
                to="/products?category=personal-care"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Personal Care
              </Link>
            </nav>
          )}

          {/* Back Button - Only show on non-home pages and not on profile-related pages */}
          {!isHomePage && !isProfileRelatedPage && (
            <div className="py-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
};

export default Header;