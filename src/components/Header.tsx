
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Vidya Medical</h1>
              <p className="text-xs text-gray-500">Trusted Healthcare</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search medicines, healthcare products..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Heart className="h-5 w-5 mr-2" />
              Wishlist
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5 mr-2" />
              Account
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
          <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
            All Products
          </Link>
          <Link to="/products?category=prescription" className="text-gray-700 hover:text-blue-600 transition-colors">
            Prescription
          </Link>
          <Link to="/products?category=otc" className="text-gray-700 hover:text-blue-600 transition-colors">
            Over-the-Counter
          </Link>
          <Link to="/products?category=supplements" className="text-gray-700 hover:text-blue-600 transition-colors">
            Supplements
          </Link>
          <Link to="/products?category=personal-care" className="text-gray-700 hover:text-blue-600 transition-colors">
            Personal Care
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
