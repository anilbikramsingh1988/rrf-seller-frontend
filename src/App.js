import React, { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, LayoutDashboard, ShoppingBag, Box, User, LogOut } from 'lucide-react';

/**
 * =========================================================
 * --- MAIN APPLICATION COMPONENT: A FULL SELLER DASHBOARD ---
 * =========================================================
 * This is the root component that holds the entire application state.
 * It manages the authentication state and conditionally renders either
 * the AuthPage (login/register) or the Dashboard.
 *
 * All sub-components (AuthPage, Dashboard, Orders, etc.) are defined within this file
 * to make it a single, self-contained, and runnable React application.
 */
export default function App() {
  // Use localStorage to check for an existing session on load.
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  // This function updates both the component state and localStorage.
  const handleSetIsAuthenticated = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('isAuthenticated', status);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      {isAuthenticated ? (
        <Dashboard handleLogout={() => handleSetIsAuthenticated(false)} />
      ) : (
        <AuthPage handleLoginSuccess={() => handleSetIsAuthenticated(true)} />
      )}
    </div>
  );
}

/**
 * --------------------------------
 * --- AUTHENTICATION PAGE COMPONENT ---
 * --------------------------------
 * This component handles both the login and registration forms.
 * It replaces the logic from your provided `AuthPage.js` and
 * makes it runnable within this single file.
 * It uses a simple `fetch` call to a mock backend.
 * @param {object} props
 * @param {function} props.handleLoginSuccess - Callback to set the authentication state on success.
 */
function AuthPage({ handleLoginSuccess }) {
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
  // This is a placeholder for a local server, as discussed previously.
  const BACKEND_URL = 'http://localhost:3001/api';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation (Email and password match)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLoading(false);
      return setError('Please enter a valid email address.');
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setLoading(false);
      return setError('Passwords do not match.');
    }
    
    // Simulate API call with a `fetch` request
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
            {/* Using a simple text input for phone to avoid extra dependencies */}
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

/**
 * ----------------------------
 * --- DASHBOARD COMPONENTS ---
 * ----------------------------
 * The following components are rendered after a successful login.
 */

function Dashboard({ handleLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'orders':
        return <Orders />;
      case 'products':
        return <Products />;
      case 'profile':
        return <Profile />;
      case 'dashboard':
      default:
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome to your Dashboard!</h2>
            <p className="mt-4 text-gray-600">Use the navigation to manage your store.</p>
          </div>
        );
    }
  };

  const navItems = [
    { name: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
    { name: 'Orders', page: 'orders', icon: ShoppingBag },
    { name: 'Products', page: 'products', icon: Box },
    { name: 'Profile', page: 'profile', icon: User },
  ];

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between rounded-r-2xl">
        <nav>
          <div className="text-3xl font-bold text-rose-600 mb-8">Radiant Rose</div>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.page}>
                  <button
                    onClick={() => setCurrentPage(item.page)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                      currentPage === item.page
                        ? 'bg-rose-100 text-rose-800 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-white font-semibold bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

function Orders() {
  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
        <ShoppingBag size={28} className="text-rose-600" />
        <span>Orders</span>
      </h2>
      <p className="mt-4 text-gray-600">
        This is where you'll see a list of all your customer orders. You can click on each order to view details,
        update the status, and track shipments.
      </p>
    </div>
  );
}

function Products() {
  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
        <Box size={28} className="text-rose-600" />
        <span>Products</span>
      </h2>
      <p className="mt-4 text-gray-600">
        Manage your product inventory, add new items, and update existing listings on this page.
        You can create, edit, or delete products and monitor their stock levels.
      </p>
    </div>
  );
}

function Profile() {
  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
        <User size={28} className="text-rose-600" />
        <span>Profile</span>
      </h2>
      <p className="mt-4 text-gray-600">
        This is where you can view and edit your seller profile details, change your password,
        and manage other account-specific settings.
      </p>
    </div>
  );
}
