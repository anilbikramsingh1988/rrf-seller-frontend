import { useState, useEffect } from 'react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Lucide React for icons
import { User, LogOut, Loader2, ArrowRight } from 'lucide-react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo2uu0URI7jdHWufHaIBh-rNJkTVOivmc",
  authDomain: "my-seller-dashboard.firebaseapp.com",
  projectId: "my-seller-dashboard",
  storageBucket: "my-seller-dashboard.firebasestorage.app",
  messagingSenderId: "745070200867",
  appId: "1:745070200867:web:0e7b9702b852ae4c6e0996",
  measurementId: "G-MNXVPP1688"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId; // Use the appId from your config

// Helper function for exponential backoff retry for API calls
const withExponentialBackoff = async (fn, retries = 5, delay = 1000) => {
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

// Main App component
export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set up Firebase Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Show a loading state until the auth status is confirmed
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md">
        {user ? (
          <Dashboard user={user} auth={auth} db={db} appId={appId} />
        ) : (
          <AuthForms auth={auth} loading={loading} setLoading={setLoading} setError={setError} db={db} appId={appId} />
        )}
        {error && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

// Component for the user's dashboard
function Dashboard({ user, auth, db, appId }) {
  const [profileData, setProfileData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && db) {
      setLoadingData(true);
      // The user-specific Firestore path
      const profilePath = `artifacts/${appId}/users/${user.uid}/profile/myProfile`;
      const docRef = doc(db, profilePath);

      // Listen for real-time updates to the user's profile document
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
          setError(null);
        } else {
          setProfileData({ name: 'No profile data found.' });
        }
        setLoadingData(false);
      }, (error) => {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data. Check security rules.");
        setLoadingData(false);
      });

      return () => unsubscribe();
    }
  }, [user, db, appId]);

  const handleSignOut = async () => {
    try {
      await withExponentialBackoff(() => signOut(auth));
    } catch (e) {
      console.error("Error signing out:", e);
      // In a real app, you might show a user-friendly error message here
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to your Dashboard!</h1>
      <p className="text-gray-600 mb-6">You are signed in as: <span className="font-semibold text-indigo-600">{user.email}</span></p>

      <div className="p-4 bg-indigo-50 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">User Profile</h2>
        {loadingData ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
            <span className="ml-2 text-indigo-500">Loading profile...</span>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-700">
            <strong>Full Name:</strong> {profileData?.name || 'N/A'} <br/>
            <strong>User ID:</strong> <code className="bg-gray-200 p-1 rounded text-sm break-all">{user.uid}</code>
          </p>
        )}
      </div>

      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Sign Out
      </button>
    </div>
  );
}

// Component for login and sign-up forms
function AuthForms({ auth, loading, setLoading, setError, db, appId }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await withExponentialBackoff(() => signInWithEmailAndPassword(auth, email, password));
      } else {
        const userCredential = await withExponentialBackoff(() => createUserWithEmailAndPassword(auth, email, password));
        const user = userCredential.user;

        // Save user profile data to Firestore
        const profilePath = `artifacts/${appId}/users/${user.uid}/profile/myProfile`;
        await withExponentialBackoff(() => setDoc(doc(db, profilePath), {
          name: fullName,
          createdAt: new Date()
        }));
      }
    } catch (e) {
      console.error("Authentication error:", e);
      const errorMessage = e.message.includes('auth/invalid-credential') ? 'Invalid email or password.' : e.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {isLogin ? 'Sign In' : 'Create an Account'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="block w-full rounded-md border-gray-300 pl-3 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 pl-3 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 pl-3 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : isLogin ? (
            <ArrowRight className="h-5 w-5 mr-2" />
          ) : (
            <User className="h-5 w-5 mr-2" />
          )}
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
