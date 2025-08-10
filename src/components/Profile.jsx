import { Loader2 } from 'lucide-react';

export default function ProfileContent({ profileData, loading, user }) {
  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">User Profile</h3>
      <p className="text-gray-600 mb-4">Update your personal information and view your user details.</p>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
          <span className="ml-2 text-indigo-500">Loading profile...</span>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-2"><strong>Full Name:</strong> {profileData?.name || 'N/A'}</p>
          <p className="mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="mb-2"><strong>User ID:</strong> <code className="bg-gray-200 p-1 rounded text-sm break-all">{user.uid}</code></p>
        </div>
      )}
    </div>
  );
}