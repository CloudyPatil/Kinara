import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
// FIX: Added 'ShieldCheck' to the list below
import { LayoutDashboard, Home, CalendarCheck, LogOut, Waves, PlusCircle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'user'; // Default to user if null
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Define Menu Items based on Role
  const menus = {
    owner: [
      { label: 'Overview', icon: LayoutDashboard, path: '/dashboard/owner' },
      { label: 'My Stays', icon: Home, path: '/dashboard/owner/stays' },
      { label: 'Bookings', icon: CalendarCheck, path: '/dashboard/owner/bookings' },
      { label: 'Add Stay', icon: PlusCircle, path: '/dashboard/owner/add-stay' },
    ],
    user: [
      { label: 'My Trips', icon: Home, path: '/dashboard/user' },
    ],
    admin: [
      { label: 'Verifications', icon: ShieldCheck, path: '/dashboard/admin' },
    ]
  };

  // Safety check: if role doesn't exist in menus, fallback to user
  const currentMenu = menus[role] ? menus[role] : menus['user'];

  return (
    <div className="min-h-screen flex bg-cream-50 dark:bg-lagoon-900 transition-colors duration-500 text-petrol-900 dark:text-cream-50">
      
      {/* --- SIDEBAR (Fixed Left) --- */}
      <aside className="w-64 bg-petrol-900 text-cream-50 flex flex-col fixed h-full z-30 hidden md:flex shadow-2xl shadow-petrol-900/50">
        
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 bg-gradient-to-br from-sunset-500 to-sunset-600 rounded-lg">
              <Waves size={20} className="text-white" />
            </div>
            <span className="text-xl font-sans font-bold tracking-tight">
              Kinara<span className="text-sunset-500">.</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 px-4 space-y-2">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-sunset-500 text-white shadow-lg shadow-sunset-500/20' 
                    : 'text-petrol-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <Outlet /> 
      </main>

    </div>
  );
}