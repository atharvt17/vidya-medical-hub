
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, MapPin, Package, LogOut, Edit, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthProvider";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-10 text-gray-500">
          Loading profile...
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleSaveProfile = (data: { displayName: string; phoneNumber: string }) => {
    // In a real app, you would update the user profile via Firebase
    console.log('Saving profile data:', data);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="text-xl">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <Button variant="outline" onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/saved-addresses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Saved Addresses</h3>
                <p className="text-gray-600 text-sm">Manage your delivery addresses</p>
                <ChevronRight className="h-5 w-5 mx-auto mt-2 text-gray-400" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/my-orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold text-lg mb-2">My Orders</h3>
                <p className="text-gray-600 text-sm">Track and view your orders</p>
                <ChevronRight className="h-5 w-5 mx-auto mt-2 text-gray-400" />
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleSignOut}>
            <CardContent className="p-6 text-center">
              <LogOut className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <h3 className="font-semibold text-lg mb-2">Sign Out</h3>
              <p className="text-gray-600 text-sm">Securely sign out of your account</p>
              <ChevronRight className="h-5 w-5 mx-auto mt-2 text-gray-400" />
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <p className="mt-1 text-gray-900">{displayName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-gray-900">{user.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Verified</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        user={user}
        onSave={handleSaveProfile}
      />

      <Footer />
    </div>
  );
};

export default Profile;
