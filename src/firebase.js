// src/firebase.js
/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration, as provided.
const yourFirebaseConfig = {
  apiKey: "AIzaSyCo2uu0URI7jdHWufHaIBh-rNJkTVOivmc",
  authDomain: "my-seller-dashboard.firebaseapp.com",
  projectId: "my-seller-dashboard",
  storageBucket: "my-seller-dashboard.firebasestorage.app",
  messagingSenderId: "745070200867",
  appId: "1:745070200867:web:0e7b9702b852ae4c6e0996",
  measurementId: "G-MNXVPP1688"
};

// This variable is provided by the runtime environment for the online editor.
// It will be empty when you run the code locally.
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : JSON.stringify(yourFirebaseConfig));
export const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.appId;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';

// Check if firebaseConfig is not an empty object before initializing the app
let app;
if (Object.keys(firebaseConfig).length > 0) {
  app = initializeApp(firebaseConfig);
} else {
  console.error("Firebase configuration is missing or invalid. App cannot be initialized.");
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const analytics = app ? getAnalytics(app) : null;

// Sign in with the provided custom token or anonymously
const signIn = async () => {
  if (!auth) {
    console.error("Authentication service not available. Skipping sign-in.");
    return;
  }
  try {
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Firebase Auth Error:", error);
  }
};

if (app) {
  signIn();
}

// Helper function for exponential backoff retry for API calls
export const withExponentialBackoff = async (fn, retries = 5, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.code === 'resource-exhausted' || error.message.includes('Quota exceeded'))) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withExponentialBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};
