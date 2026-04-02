"use client"; // Add this at the very top!
import React, { useState } from 'react';
import AddProductModal from '@/components/AddProductModal';
import { Filter, MoreVertical, Plus, Search } from 'lucide-react';
// ... other imports

const InventoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const mockProducts = [
    { id: '1', name: 'Premium Leather Watch', category: 'Accessories', price: 120, stock: 15, status: 'In Stock' },
    { id: '2', name: 'Smart Fitness Tracker', category: 'Electronics', price: 85, stock: 3, status: 'Low Stock' },
    { id: '3', name: 'Designer Sunglasses', category: 'Fashion', price: 250, stock: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500">Track and manage your product stock levels.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* The Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wider">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-slate-600">{product.category}</td>
                <td className="px-6 py-4 text-slate-600">${product.price}</td>
                <td className="px-6 py-4 text-slate-600">{product.stock} units</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Place the Modal at the bottom */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default InventoryPage;