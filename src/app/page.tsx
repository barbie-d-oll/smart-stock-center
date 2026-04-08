"use client";
import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import AIInsights from '@/components/AIInsights';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Product {
  category: string;
  stockQuantity: number;
  lowStockThreshold: number;
  price: number;
  name: string;
}

export default function Dashboard() {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, totalValue: 0 });
  const [chartData, setChartData] = useState<{ name: string; stock: number }[]>([]);

  useEffect(() => {
    // We use a query to get the most recent updates first
    const q = query(collection(db, 'products'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as Product);
      
      // 1. Sync Raw Data for AI Insights
      setRawProducts(docs);

      // 2. Calculate Dashboard Stats
      const total = docs.length;
      const low = docs.filter((item: Product) => item.stockQuantity <= (item.lowStockThreshold || 5)).length;
      const value = docs.reduce((acc: number, item: Product) => acc + (item.price * item.stockQuantity), 0);
      
      setStats({ totalItems: total, lowStock: low, totalValue: value });

      // 3. Prepare Chart Data (Group by Category)
      const categories: Record<string, number> = {};
      docs.forEach((item: Product) => {
        const cat = item.category || 'Uncategorized';
        categories[cat] = (categories[cat] || 0) + item.stockQuantity;
      });
      
      const formattedData = Object.keys(categories).map(cat => ({
        name: cat,
        stock: categories[cat]
      }));
      setChartData(formattedData);
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalItems, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Inventory Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory Insights</h1>
        <p className="text-slate-500 font-medium">Real-time overview of your SmartStock Center.</p>
      </div>

      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-colors">
            <div className={`${card.bg} p-4 rounded-xl`}>
              <card.icon className={card.color} size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Analysis Row (Chart + AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <TrendingUp className="text-white" size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Stock Distribution</h2>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="stock" radius={[8, 8, 0, 0]} barSize={45}>
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#60a5fa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="lg:col-span-1">
          <AIInsights products={rawProducts} />
        </div>

      </div>
    </div>
  );
}