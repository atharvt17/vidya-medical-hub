// src/firebase/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
    apiKey: " ",
    authDomain: " ",
    projectId: " ",
    storageBucket: " ",
    messagingSenderId: " ",
    appId: " ",
    measurementId: " "
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth, RecaptchaVerifier, signInWithPhoneNumber }
