
// src/firebase/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBO_wA3B0SIOSYI_708YXof-VCQgZftX1k",
    authDomain: "vidya-medical-store.firebaseapp.com",
    projectId: "vidya-medical-store",
    storageBucket: "vidya-medical-store.firebasestorage.app",
    messagingSenderId: "233743943436",
    appId: "1:233743943436:web:9f236db85a2132b91d6b29",
    measurementId: "G-1ERYRLERGF"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth, RecaptchaVerifier }
