import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { User, LogOut, LayoutDashboard, Box, ShoppingBag, Truck, ShoppingCart, CreditCard, Settings, Loader2 } from 'lucide-react';
import { auth, db, withExponentialBackoff, appId } from '../firebase';
import { OverviewContent, ProductsContent, ShopContent, ShipmentContent, OrdersContent, PaymentsContent, ManagementContent } from './ContentSections';
import ProfileContent from './Profile';

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && db) {
      setLoadingProfile(true);
      const profilePath = `artifacts/${appId}/users/${user.uid}/profile/myProfile`;
      const docRef = doc(db, profilePath);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
          setError(null);
        } else {
          setProfileData({ name: 'No profile data found.' });
        }
        setLoadingProfile(false);
      }, (error) => {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data. Check security rules.");
        setLoadingProfile(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await withExponentialBackoff(() => signOut(auth));
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewContent />;
      case 'products':
        return <ProductsContent />;
      case 'orders':
        return <OrdersContent />;
      case 'shipment':
        return <ShipmentContent />;
      case 'payments':
        return <PaymentsContent />;
      case 'shop':
        return <ShopContent />;
      case 'profile':
        return <ProfileContent profileData={profileData} loading={loadingProfile} user={user} />;
      case 'management':
        return <ManagementContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col lg:flex-row min-h-[80vh]">
      <aside className="bg-indigo-700 text-indigo-100 p-6 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none flex flex-col flex-shrink-0 w-full lg:w-64">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-8">Seller Dashboard</h2>
          <nav>
            <NavItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => setActiveTab('dashboard')} active={activeTab === 'dashboard'} />
            <NavItem icon={<Box />} label="Products" onClick={() => setActiveTab('products')} active={activeTab === 'products'} />
            <NavItem icon={<ShoppingCart />} label="Orders" onClick={() => setActiveTab('orders')} active={activeTab === 'orders'} />
            <NavItem icon={<Truck />} label="Shipment" onClick={() => setActiveTab('shipment')} active={activeTab === 'shipment'} />
            <NavItem icon={<CreditCard />} label="Payments" onClick={() => setActiveTab('payments')} active={activeTab === 'payments'} />
            <NavItem icon={<ShoppingBag />} label="Shop Settings" onClick={() => setActiveTab('shop')} active={activeTab === 'shop'} />
            <NavItem icon={<Settings />} label="Other Management" onClick={() => setActiveTab('management')} active={activeTab === 'management'} />
          </nav>
        </div>
        <div className="mt-8">
          <NavItem icon={<User />} label="Profile" onClick={() => setActiveTab('profile')} active={activeTab === 'profile'} />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-red-600 transition-colors mt-2 text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <p className="text-gray-500 mt-2">Welcome, {profileData?.name || 'Seller'}!</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner min-h-[50vh]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Nav Item Component
function NavItem({ icon, label, onClick, active }) {
  const activeClass = active ? 'bg-indigo-800' : 'hover:bg-indigo-600';
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeClass}`}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </button>
  );
}