import React from 'react';
import { Box } from 'lucide-react';

export default function Products() {
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
