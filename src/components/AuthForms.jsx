// src/components/AuthForms.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { auth, db, withExponentialBackoff, appId } from '../firebase';

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase Auth is not available.");
      if (!db) throw new Error("Firebase Firestore is not available.");

      if (isLogin) {
        await withExponentialBackoff(() => signInWithEmailAndPassword(auth, email, password));
      } else {
        if (password !== retypePassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        const userCredential = await withExponentialBackoff(() => createUserWithEmailAndPassword(auth, email, password));
        const user = userCredential.user;

        const profilePath = `artifacts/${appId}/users/${user.uid}/profile/myProfile`;
        await withExponentialBackoff(() => setDoc(doc(db, profilePath), {
          firstName,
          lastName,
          storeName,
          phoneNumber,
          createdAt: new Date()
        }));
      }
    } catch (e) {
      console.error("Authentication error:", e);
      let errorMessage = e.message;
      if (e.message.includes('auth/invalid-credential')) {
        errorMessage = 'Invalid email or password.';
      } else if (e.message.includes('auth/weak-password')) {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (e.message.includes('auth/email-already-in-use')) {
        errorMessage = 'This email is already in use.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 ease-in-out w-full lg:max-w-xl">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {isLogin ? 'Sign In' : 'Create an Account'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder="My Awesome Store"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder="(123) 456-7890"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 pr-10 shadow-sm sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Retype Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showPassword ? 'text' : 'password'}
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 pr-10 shadow-sm sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : isLogin ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-5 w-5 mr-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5 mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          )}
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setFirstName('');
            setLastName('');
            setStoreName('');
            setPhoneNumber('');
            setEmail('');
            setPassword('');
            setRetypePassword('');
          }}
          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
      {error && (
        <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
