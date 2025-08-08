import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Orders() {
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
