
import { auth } from './firebase';
import { User } from 'firebase/auth';

const DJANGO_API_BASE = 'http://localhost:8000/api';

export interface DjangoAuthResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  token?: string;
  message?: string;
}

export const authenticateWithDjango = async (firebaseUser: User): Promise<DjangoAuthResponse | null> => {
  try {
    // Get the Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    
    console.log('Sending Firebase ID token to Django backend...');
    
    // Send token to Django backend
    const response = await fetch(`${DJANGO_API_BASE}/auth/firebase-signin/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        firebase_token: idToken,
      }),
    });

    if (!response.ok) {
      console.error('Django authentication failed:', response.status, response.statusText);
      return null;
    }

    const data: DjangoAuthResponse = await response.json();
    console.log('Django authentication successful:', data);
    
    return data;
  } catch (error) {
    console.error('Error authenticating with Django backend:', error);
    return null;
  }
};

export const syncUserWithDjango = async (): Promise<DjangoAuthResponse | null> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    console.log('No Firebase user found');
    return null;
  }

  return await authenticateWithDjango(currentUser);
};
