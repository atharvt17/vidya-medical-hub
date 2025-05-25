// src/firebase/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBO_wA3B0SIOSYI_708YXof-VCQgZftX1k",
    authDomain: "vidya-medical-store.firebaseapp.com",
    projectId: "vidya-medical-store",
    storageBucket: "vidya-medical-store.firebasestorage.app",
    messagingSenderId: "233743943436",
    appId: "1:233743943436:web:ffd1c4ee3e64b9ea1d6b29",
    measurementId: "G-828B9JM6R2"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth, RecaptchaVerifier, signInWithPhoneNumber }
