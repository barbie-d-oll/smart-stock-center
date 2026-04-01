import React from 'react';
import { 
  LayoutDashboard, 
  Box, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Package
} from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Box, label: 'Inventory', href: '/inventory' },
    { icon: ShoppingCart, label: 'Sales', href: '/sales' },
    { icon: BarChart3, label: 'AI Insights', href: '/ai-reports' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <Package className="text-blue-500" size={28} />
        <span className="text-xl font-bold tracking-tight">
          Smart<span className="text-blue-500">Stock</span>
        </span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link 
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 p-3 text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 group"
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex w-full items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;