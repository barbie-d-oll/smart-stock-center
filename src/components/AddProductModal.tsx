"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Define what a Product looks like for TypeScript
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InventoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // THE "LIVE PLUG": Listen to Firebase in real-time
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      setProducts(productData);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener when we leave the page
  }, []);

  // Helper function to show status badges based on stock logic
  const getStatus = (stock: number, threshold: number) => {
    if (stock <= 0) return { label: 'Out of Stock', css: 'bg-red-100 text-red-700' };
    if (stock <= threshold) return { label: 'Low Stock', css: 'bg-amber-100 text-amber-700' };
    return { label: 'In Stock', css: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500">Real-time stock tracking from Firebase.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-500 font-medium">Fetching your inventory...</p>
          </div>
        ) : (
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
              {products.map((product) => {
                const status = getStatus(product.stockQuantity, product.lowStockThreshold);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 text-slate-600">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600">{product.stockQuantity} units</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.css}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AddProductModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// This is a placeholder for the AddProductModal component
// It should be in its own file: src/components/AddProductModal.tsx
const AddProductModalComponent = ({ isOpen, onClose }: AddProductModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        {/* Add your form fields here */}
        <button 
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InventoryPage;