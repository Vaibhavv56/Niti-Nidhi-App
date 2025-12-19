import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Get these values from Firebase Console → Project Settings → Your apps → Web app
// IMPORTANT: Update these values in your .env file!

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyReplaceWithRealOne",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "techfest-85e3b.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "techfest-85e3b",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "techfest-85e3b.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Validate config
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('Dummy') || firebaseConfig.apiKey === 'your-api-key' || firebaseConfig.apiKey.length < 20) {
  console.error('❌ Firebase config not set properly!');
  console.error('Current apiKey:', firebaseConfig.apiKey);
  console.error('Add EXPO_PUBLIC_FIREBASE_* variables to .env file in project root');
  console.error('Get config from: Firebase Console → Project Settings → Your apps → Web app');
  console.error('After adding .env, restart app with: npm start -- --clear');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

