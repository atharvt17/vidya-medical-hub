import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Filter, Grid, List } from "lucide-react";
import { useQuery } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { GET_PRODUCTS } from "@/lib/queries/products";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  stockQuantity: number;
  manufacturer: string,
  requiresPrescription: boolean;
  rating: number;
  ingredients: string[];
}

const Products = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const products: Product[] = data?.products || [];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category.toLowerCase())) {
        return false;
      }
      
      // Price range filter
      if (selectedPriceRanges.length > 0) {
        const priceInRange = selectedPriceRanges.some(range => {
          switch (range) {
            case 'under-50': return product.price < 50;
            case '50-100': return product.price >= 50 && product.price <= 100;
            case '100-200': return product.price >= 100 && product.price <= 200;
            case 'above-200': return product.price > 200;
            default: return false;
          }
        });
        if (!priceInRange) return false;
      }
      
      // Stock filter
      if (inStockOnly && product.stockQuantity <= 0) {
        return false;
      }
      
      // Prescription filter
      if (prescriptionOnly && !product.requiresPrescription) {
        return false;
      }
      
      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...filtered].sort((a, b) => b.id.localeCompare(a.id));
      case 'featured':
      default:
        return filtered;
    }
  }, [products, selectedCategories, selectedPriceRanges, inStockOnly, prescriptionOnly, sortBy]);

  // Generate dynamic categories from products
  const categories = useMemo(() => {
    const categoryMap = new Map();
    products.forEach(product => {
      const category = product.category.toLowerCase();
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + 1);
      } else {
        categoryMap.set(category, 1);
      }
    });
    
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count
    }));
  }, [products]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handlePriceRangeChange = (rangeId: string, checked: boolean) => {
    if (checked) {
      setSelectedPriceRanges([...selectedPriceRanges, rangeId]);
    } else {
      setSelectedPriceRanges(selectedPriceRanges.filter(id => id !== rangeId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error loading products: {error.message}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            <p className="text-gray-600">Showing {filteredAndSortedProducts.length} products</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Select value={sortBy} onValueChange={setSortBy}>
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
                        <Checkbox 
                          id={category.id} 
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                        />
                        <Label htmlFor={category.id} className="text-sm flex-1 cursor-pointer">
                          {category.name}
                        </Label>
                        <span className="text-xs text-gray-500">({category.count})</span>
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
                      <Checkbox 
                        id="under-50" 
                        checked={selectedPriceRanges.includes('under-50')}
                        onCheckedChange={(checked) => handlePriceRangeChange('under-50', checked as boolean)}
                      />
                      <Label htmlFor="under-50" className="text-sm cursor-pointer">Under ₹50</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="50-100" 
                        checked={selectedPriceRanges.includes('50-100')}
                        onCheckedChange={(checked) => handlePriceRangeChange('50-100', checked as boolean)}
                      />
                      <Label htmlFor="50-100" className="text-sm cursor-pointer">₹50 - ₹100</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="100-200" 
                        checked={selectedPriceRanges.includes('100-200')}
                        onCheckedChange={(checked) => handlePriceRangeChange('100-200', checked as boolean)}
                      />
                      <Label htmlFor="100-200" className="text-sm cursor-pointer">₹100 - ₹200</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="above-200" 
                        checked={selectedPriceRanges.includes('above-200')}
                        onCheckedChange={(checked) => handlePriceRangeChange('above-200', checked as boolean)}
                      />
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
                      <Checkbox 
                        id="in-stock" 
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                      />
                      <Label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="prescription-required" 
                        checked={prescriptionOnly}
                        onCheckedChange={(checked) => setPrescriptionOnly(checked as boolean)}
                      />
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
              {filteredAndSortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.imageUrl,
                    brand: product.manufacturer,
                    rating: product.rating,
                    prescription: product.requiresPrescription,
                    inStock: product.stockQuantity > 0
                  }} 
                />
              ))}
            </div>
            
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedPriceRanges([]);
                    setInStockOnly(false);
                    setPrescriptionOnly(false);
                  }}
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;