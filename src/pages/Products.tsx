
import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Grid, List, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Products = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);

  const products = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      price: 25.50,
      originalPrice: 30.00,
      rating: 4.5,
      reviews: 234,
      category: "prescription",
      brand: "Cipla",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
      inStock: true,
      prescription: true
    },
    {
      id: 2,
      name: "Vitamin D3 Tablets",
      price: 180.00,
      originalPrice: 200.00,
      rating: 4.7,
      reviews: 156,
      category: "supplements",
      brand: "HealthKart",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      inStock: true,
      prescription: false
    },
    {
      id: 3,
      name: "Hand Sanitizer 100ml",
      price: 45.00,
      originalPrice: 50.00,
      rating: 4.3,
      reviews: 89,
      category: "personal-care",
      brand: "Dettol",
      image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=300&fit=crop",
      inStock: true,
      prescription: false
    },
    {
      id: 4,
      name: "Omega-3 Fish Oil",
      price: 350.00,
      originalPrice: 400.00,
      rating: 4.6,
      reviews: 198,
      category: "supplements",
      brand: "NOW Foods",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
      inStock: true,
      prescription: false
    },
    {
      id: 5,
      name: "Baby Lotion 200ml",
      price: 120.00,
      originalPrice: 140.00,
      rating: 4.8,
      reviews: 312,
      category: "baby-care",
      brand: "Johnson's",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
      inStock: true,
      prescription: false
    },
    {
      id: 6,
      name: "Cough Syrup 100ml",
      price: 85.00,
      originalPrice: 95.00,
      rating: 4.4,
      reviews: 145,
      category: "otc",
      brand: "Benadryl",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop",
      inStock: false,
      prescription: false
    }
  ];

  const categories = [
    { id: "prescription", name: "Prescription", count: 24 },
    { id: "otc", name: "Over-the-Counter", count: 18 },
    { id: "supplements", name: "Supplements", count: 32 },
    { id: "personal-care", name: "Personal Care", count: 45 },
    { id: "baby-care", name: "Baby Care", count: 15 }
  ];

  const brands = [
    { id: "cipla", name: "Cipla", count: 12 },
    { id: "healthkart", name: "HealthKart", count: 8 },
    { id: "dettol", name: "Dettol", count: 6 },
    { id: "johnson", name: "Johnson's", count: 9 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900">Products</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">Showing {products.length} products</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Select defaultValue="featured">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 space-y-6">
              {/* Categories Filter */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox id={category.id} />
                        <Label htmlFor={category.id} className="text-sm flex-1 cursor-pointer">
                          {category.name}
                        </Label>
                        <span className="text-xs text-gray-500">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Brands Filter */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Brands</h3>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox id={brand.id} />
                        <Label htmlFor={brand.id} className="text-sm flex-1 cursor-pointer">
                          {brand.name}
                        </Label>
                        <span className="text-xs text-gray-500">({brand.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="under-50" />
                      <Label htmlFor="under-50" className="text-sm cursor-pointer">Under ₹50</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="50-100" />
                      <Label htmlFor="50-100" className="text-sm cursor-pointer">₹50 - ₹100</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="100-200" />
                      <Label htmlFor="100-200" className="text-sm cursor-pointer">₹100 - ₹200</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="above-200" />
                      <Label htmlFor="above-200" className="text-sm cursor-pointer">Above ₹200</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Filter */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-stock" />
                      <Label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="prescription-required" />
                      <Label htmlFor="prescription-required" className="text-sm cursor-pointer">Prescription Required</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                      {product.prescription && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Rx Required
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{product.brand}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <Button size="sm" disabled={!product.inStock}>
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
