import React from 'react';
import { User } from 'lucide-react';

export default function Profile() {
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
