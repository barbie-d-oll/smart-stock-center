import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface Product {
  name: string;
  stockQuantity: number;
  lowStockThreshold: number;
}

const AIInsights = ({ products }: { products: unknown[] }) => {
  // Simple Logic to simulate "AI" analysis
  const typedProducts = products as Product[];
  const lowStockItems = typedProducts.filter(p => p.stockQuantity <= 5);
  const outOfStock = typedProducts.filter(p => p.stockQuantity === 0);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg border border-blue-400/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-blue-200" />
        <h3 className="font-bold text-lg">Smart Inventory Assistant</h3>
      </div>

      <div className="space-y-4">
        {outOfStock.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-sm text-blue-100 mb-1 font-medium uppercase tracking-wider">Critical Action</p>
            <p className="text-white">You have <span className="font-bold">{outOfStock.length} items</span> completely out of stock. This is costing you potential sales.</p>
          </div>
        ) : lowStockItems.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-sm text-blue-100 mb-1 font-medium uppercase tracking-wider">Restock Suggestion</p>
            <p className="text-white">Trend analysis suggests restocking <span className="font-bold">{lowStockItems[0]?.name}</span> soon to avoid a stockout.</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <p className="text-sm text-blue-100 mb-1 font-medium uppercase tracking-wider">Status</p>
            <p className="text-white">Inventory levels are currently optimized. No immediate actions required.</p>
          </div>
        )}
        
        <button className="flex items-center justify-between w-full bg-white/20 hover:bg-white/30 transition-all p-3 rounded-lg text-sm font-medium">
          View Detailed AI Report
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIInsights;