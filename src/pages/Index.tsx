import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Index = () => {
  const categories = [{
    name: "Prescription Medicines",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop",
    description: "Doctor prescribed medications",
    link: "/products?category=prescription"
  }, {
    name: "Health Supplements",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
    description: "Vitamins & nutritional supplements",
    link: "/products?category=supplements"
  }, {
    name: "Personal Care",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=300&h=200&fit=crop",
    description: "Daily care essentials",
    link: "/products?category=personal-care"
  }, {
    name: "Baby Care",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop",
    description: "Safe products for babies",
    link: "/products?category=baby-care"
  }];
  const stats = [{
    icon: Users,
    number: "50,000+",
    label: "Happy Customers"
  }, {
    icon: Award,
    number: "15+",
    label: "Years Experience"
  }, {
    icon: Zap,
    number: "24/7",
    label: "Customer Support"
  }, {
    icon: Star,
    number: "4.8",
    label: "Customer Rating"
  }];
  return <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Health,
                <span className="text-blue-200"> Our Priority</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Trusted online pharmacy with authentic medicines, fast delivery, and expert care for your entire family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Upload Prescription
                </Button>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&h=400&fit=crop" alt="Healthcare" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Find what you need for your health and wellness</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => <Link key={index} to={category.link}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <img src={category.image} alt={category.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need help choosing the right medicine?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our licensed pharmacists are available 24/7 to help you with your healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Consult Pharmacist
            </Button>
            <Button size="lg" variant="outline">Call: +91 8770042459</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;