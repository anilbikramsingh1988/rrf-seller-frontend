import React, { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function AuthPage({ handleLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔴 IMPORTANT: Replace this URL with your actual backend endpoint.
  // This is a placeholder for a local server.
  const BACKEND_URL = 'https://seller-portal-backend.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLoading(false);
      return setError('Please enter a valid email address.');
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setLoading(false);
      return setError('Passwords do not match.');
    }
    
    // API call using fetch
    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          handleLoginSuccess();
        } else {
          setError('Registration successful! Please log in.');
          setIsLogin(true); // Switch to login view after successful registration
        }
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to connect to the server. Check if your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
      <h1 className="text-3xl font-bold text-center text-rose-600 mb-6">
        {isLogin ? 'Seller Login' : 'Register as a Seller'}
      </h1>

      {error && (
        <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Registration-only fields */}
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </>
        )}
        
        {/* Common fields */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Registration-only confirm password */}
        {!isLogin && (
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          />
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:bg-rose-400"
        >
          {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      
      {/* Toggle Login/Register view */}
      <p className="text-center text-gray-500 mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button
          type="button"
          className="text-rose-600 font-semibold"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );

  return formContent;
}
