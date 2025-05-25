import { useState, useEffect } from "react";
import { Upload, Scan, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthProvider";

const UploadPrescription = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return null; // prevent showing the page momentarily
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const steps = [
    {
      number: "01",
      title: "Upload Your Prescription",
      description:
        "Snap a photo or upload a scan of your doctor’s prescription — we accept JPEG, PNG, and PDF files. It’s quick, easy, and secure.",
      icon: Upload,
      color: "bg-blue-500",
    },
    {
      number: "02",
      title: "Prescription Review by Our Pharmacists",
      description:
        "Our licensed pharmacists carefully review your prescription for accuracy and compliance. If anything needs clarification, we’ll get in touch right away.",
      icon: Scan,
      color: "bg-green-500",
    },
    {
      number: "03",
      title: "Fast & Reliable Delivery",
      description:
        "Once approved, your medications are prepared and shipped directly to your doorstep — often within 24 hours via our express delivery service.",
      icon: Truck,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upload Your <span className="text-blue-600">Prescription</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your prescribed medicines delivered safely and quickly. Our
            simple 3-step process ensures you receive authentic medications with
            complete convenience.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-16 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Prescription
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your prescription or click to browse
                </p>
                <input
                  type="file"
                  id="prescription-upload"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="prescription-upload">
                  <Button className="cursor-pointer">Choose File</Button>
                </label>
              </div>

              {uploadedFile && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {uploadedFile.name} uploaded successfully
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Steps Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </div>

                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-300">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Our pharmacists are available 24/7 to assist you with your
            prescription uploads and any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Contact Pharmacist
            </Button>
            <Button size="lg" variant="outline">
              Call: +91 8770042459
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadPrescription;
