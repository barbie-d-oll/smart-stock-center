"use client";
import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import AIInsights from '@/components/AIInsights';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Product {
  category: string;
  stockQuantity: number;
  lowStockThreshold: number;
  price: number;
}

export default function Dashboard() {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, totalValue: 0 });
  const [chartData, setChartData] = useState<unknown[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as Product);
      
      // Calculate Stats
      const total = docs.length;
      const low = docs.filter((item: Product) => item.stockQuantity <= item.lowStockThreshold).length;
      const value = docs.reduce((acc: number, item: Product) => acc + (item.price * item.stockQuantity), 0);
      
      setStats({ totalItems: total, lowStock: low, totalValue: value });

      // Prepare Chart Data (Group by Category)
      const categories: Record<string, number> = {};
      docs.forEach((item: Product) => {
        categories[item.category] = (categories[item.category] || 0) + item.stockQuantity;
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory Insights</h1>
        <p className="text-slate-500">Real-time overview of your warehouse performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`${card.bg} p-4 rounded-xl`}>
              <card.icon className={card.color} size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-slate-800">Stock Levels by Category</h2>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{fill: '#f8fafc'}}
              />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}