import React from 'react';

export default function StatCard({ title, value, icon: Icon, color }) {
  // Color mapping for different stats
  const colors = {
    orange: 'bg-sunset-500 shadow-sunset-500/30',
    blue: 'bg-blue-500 shadow-blue-500/30',
    green: 'bg-emerald-500 shadow-emerald-500/30',
    purple: 'bg-purple-500 shadow-purple-500/30',
  };

  return (
    <div className="bg-white dark:bg-lagoon-800 p-6 rounded-3xl border border-petrol-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-petrol-400 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl text-white shadow-lg ${colors[color] || colors.blue}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}