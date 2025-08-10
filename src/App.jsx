// src/App.jsx
// This is the main App component that handles user authentication and routing.
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Import the auth instance from firebase.js

import Dashboard from './components/Dashboard';
import AuthForms from './components/AuthForms';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasFirebaseError, setHasFirebaseError] = useState(false);

  useEffect(() => {
    // Check if auth is a valid object before trying to use it.
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        setUser(authUser);
        setIsAuthReady(true);
      });
      return () => unsubscribe();
    } else {
      // If auth is null, it means Firebase failed to initialize.
      setHasFirebaseError(true);
      setIsAuthReady(true);
    }
  }, []);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  if (hasFirebaseError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 text-red-800">
          <h2 className="text-xl font-bold mb-4">Application Error</h2>
          <p>The Firebase application could not be initialized due to an invalid configuration. Please check the `__firebase_config` provided to the app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-7xl">
        {user ? (
          <Dashboard user={user} />
        ) : (
          <AuthForms />
        )}
      </div>
    </div>
  );
}
