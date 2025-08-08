import React, { useState } from 'react';
import { LogOut, LayoutDashboard, ShoppingBag, Box, User } from 'lucide-react';
import Orders from './Orders';
import Products from './Products';
import Profile from './Profile';

export default function Dashboard({ handleLogout }) {
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
