import { Heart, Shield, Truck, Clock } from "lucide-react";
const Footer = () => {
  return <footer className="bg-gray-900 text-white">
      {/* Trust Indicators */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <h3 className="font-semibold">Authentic Products</h3>
              <p className="text-sm text-gray-300">100% genuine medicines</p>
            </div>
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold">Fast Delivery</h3>
              <p className="text-sm text-gray-300">Same day delivery</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-300">Always here to help</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-400" />
              <h3 className="font-semibold">Healthcare First</h3>
              <p className="text-sm text-gray-300">Your health matters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Vidya Medical Store</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your trusted partner in healthcare. Providing authentic medicines and healthcare products with care.
              </p>
              <p className="text-gray-400 text-xs">
                Licensed Pharmacy | Est. 2020
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>📞 +91 98765 43210</p>
                <p>📧 care@vidyamedical.com</p>
                <p>📍 Vidya Medical Store, Near Mahamaya Chowk, Rajnandgaon 491441</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            © 2024 Vidya Medical Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;