import React, { useEffect, useState } from 'react';
import { Shield, Check, X, Ban, User, Phone, Users, LayoutDashboard, Search } from 'lucide-react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'hosts', 'users'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Data based on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'pending') endpoint = '/admin/unverified-owners';
      if (activeTab === 'hosts') endpoint = '/admin/all-owners';
      if (activeTab === 'users') endpoint = '/admin/all-users';
      
      const res = await api.get(endpoint);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Actions
  const handleVerify = async (id) => {
    if(!confirm("Verify this owner?")) return;
    await api.post(`/admin/verify-owner/${id}`);
    fetchData();
  };

  const handleBanToggle = async (id, currentStatus) => {
    const action = currentStatus ? "Ban" : "Unban";
    if(!confirm(`Are you sure you want to ${action} this owner?`)) return;
    await api.post(`/admin/toggle-status/${id}`);
    fetchData();
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50">Admin Console</h1>
        <p className="text-petrol-500">Platform Overview & Security Control</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-petrol-100 dark:border-white/10 pb-1">
        <TabButton label="Pending Verifications" active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={<Shield size={16}/>} />
        <TabButton label="Manage Hosts" active={activeTab === 'hosts'} onClick={() => setActiveTab('hosts')} icon={<LayoutDashboard size={16}/>} />
        <TabButton label="Travelers" active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={16}/>} />
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-lagoon-800 rounded-3xl border border-petrol-100 dark:border-white/5 shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
            <div className="p-10 text-center text-petrol-500">Loading data...</div>
        ) : (
            <table className="w-full text-left">
            <thead className="bg-petrol-50 dark:bg-white/5 text-xs font-bold text-petrol-500 uppercase">
                <tr>
                <th className="p-6">Name / ID</th>
                <th className="p-6">Contact</th>
                <th className="p-6">Status / Role</th>
                <th className="p-6 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-petrol-100 dark:divide-white/5 text-sm text-petrol-700 dark:text-cream-100">
                {data.length > 0 ? data.map(item => (
                <tr key={item.id}>
                    <td className="p-6 font-bold">
                        {item.name} <span className="text-xs font-normal text-petrol-400">#{item.id}</span>
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col">
                            <span>{item.email}</span>
                            <span className="text-xs text-petrol-500 flex items-center gap-1"><Phone size={10}/> {item.phone_number || "N/A"}</span>
                        </div>
                    </td>
                    
                    {/* Status Column */}
                    <td className="p-6">
                        {activeTab === 'users' ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Traveler</span>
                        ) : (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.is_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.is_verified ? 'Verified' : 'Unverified / Banned'}
                            </span>
                        )}
                    </td>

                    {/* Actions Column */}
                    <td className="p-6 text-right">
                        {activeTab === 'pending' && (
                            <button onClick={() => handleVerify(item.id)} className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition flex items-center gap-2 ml-auto text-xs font-bold">
                                <Check size={14}/> Verify
                            </button>
                        )}
                        {activeTab === 'hosts' && (
                            <button 
                                onClick={() => handleBanToggle(item.id, item.is_verified)} 
                                className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ml-auto text-xs font-bold border ${item.is_verified ? 'border-red-200 text-red-500 hover:bg-red-50' : 'bg-green-500 text-white hover:bg-green-600'}`}
                            >
                                {item.is_verified ? <><Ban size={14}/> Ban User</> : <><Check size={14}/> Activate</>}
                            </button>
                        )}
                        {activeTab === 'users' && <span className="text-xs text-petrol-400">Analytics Only</span>}
                    </td>
                </tr>
                )) : (
                <tr><td colSpan="4" className="p-10 text-center text-petrol-400">No records found.</td></tr>
                )}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick, icon }) {
    return (
        <button 
            onClick={onClick}
            className={`pb-2 px-4 flex items-center gap-2 text-sm font-bold transition-colors border-b-2 ${
                active 
                ? 'border-orange-500 text-orange-500' 
                : 'border-transparent text-petrol-400 hover:text-petrol-600'
            }`}
        >
            {icon} {label}
        </button>
    )
}