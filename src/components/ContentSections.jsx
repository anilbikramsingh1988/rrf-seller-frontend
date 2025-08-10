import { useState } from 'react';

// Mock data for demonstration
const mockProducts = [
  { id: 1, name: 'Eco-Friendly Water Bottle', price: 15.99, stock: 150 },
  { id: 2, name: 'Wireless Bluetooth Headphones', price: 79.99, stock: 80 },
  { id: 3, name: 'Minimalist Desk Lamp', price: 45.00, stock: 200 },
];

const mockOrders = [
  { id: 101, customer: 'Jane Doe', status: 'Shipped', total: 65.50 },
  { id: 102, customer: 'John Smith', status: 'Processing', total: 120.00 },
  { id: 103, customer: 'Emily White', status: 'Delivered', total: 30.25 },
];

const mockPayments = [
  { id: 201, date: '2025-08-01', amount: 120.50, status: 'Completed' },
  { id: 202, date: '2025-08-02', amount: 85.00, status: 'Pending' },
  { id: 203, date: '2025-08-03', amount: 200.75, status: 'Completed' },
];

export const OverviewContent = () => (
  <div className="p-4">
    <h3 className="text-2xl font-semibold mb-4">Dashboard Overview</h3>
    <p>This is the main dashboard overview. You can add widgets here to show key metrics like total sales, pending orders, and top-selling products.</p>
  </div>
);

export const ProductsContent = () => (
  <div className="p-4">
    <h3 className="text-2xl font-semibold mb-4">Product Management</h3>
    <p className="text-gray-600 mb-4">Manage your inventory, add new products, and update existing ones.</p>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {mockProducts.map(product => (
          <li key={product.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">Price: ${product.price.toFixed(2)}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                Stock: {product.stock}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const ShopContent = () => (
  <div className="p-4">
    <h3 className="text-2xl font-semibold mb-4">Shop Settings</h3>
    <p>Configure your shop's appearance, policies, and contact information here.</p>
  </div>
);

export const ShipmentContent = () => (
  <div className="p-4">
    <h3 className="text-2xl font-semibold mb-4">Shipment Management</h3>
    <p>Track packages, manage shipping carriers, and handle logistics for your orders.</p>
  </div>
);

export const OrdersContent = () => (
  <div className="p-4">
    <h3 className="text-2xl font-semibold mb-4">Order Management</h3>
    <p className="text-gray-600 mb-4">View and process incoming orders.</p>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {mockOrders.map(order => (
          <li key={order.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Order #{order.id}</p>
                <p className="text-sm text-gray-500">Customer: {order.customer}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const PaymentsContent = () => (
  <div className="p-4">
    <h3 className="text-2xl font-semibold mb-4">Payments & Transactions</h3>
    <p className="text-gray-600 mb-4">View your payment history and manage payout settings.</p>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {mockPayments.map(payment => (
          <li key={payment.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Transaction #{payment.id}</p>
                <p className="text-sm text-gray-500">Date: {payment.date}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                Amount: ${payment.amount.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const ManagementContent = () => (
  <div className="p-4">
    <h3 className="2xl font-semibold mb-4">Other Management</h3>
    <p>This is a placeholder for other tools you might need, like team member management, reports, or analytics.</p>
  </div>
);