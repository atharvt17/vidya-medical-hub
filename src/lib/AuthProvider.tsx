
// src/lib/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";
import { authenticateWithDjango, DjangoAuthResponse } from "./authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  djangoUser: DjangoAuthResponse | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  djangoUser: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [djangoUser, setDjangoUser] = useState<DjangoAuthResponse | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('Firebase user authenticated, syncing with Django...');
        
        // Wait a bit if this is a new user without displayName to allow updateProfile to complete
        if (!firebaseUser.displayName) {
          console.log('No display name found, waiting for profile update...');
          setTimeout(async () => {
            // Reload user to get updated profile and use the refreshed user from auth.currentUser
            await firebaseUser.reload();
            const refreshedUser = auth.currentUser;
            if (refreshedUser) {
              const djangoResponse = await authenticateWithDjango(refreshedUser);
              setDjangoUser(djangoResponse);
            }
          }, 1000);
        } else {
          // User has display name, proceed immediately
          const djangoResponse = await authenticateWithDjango(firebaseUser);
          setDjangoUser(djangoResponse);
        }
      } else {
        setDjangoUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setDjangoUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, djangoUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
