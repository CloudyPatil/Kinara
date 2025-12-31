import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Waves, User, LogOut, LayoutDashboard } from 'lucide-react'; 

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Check Auth Status
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsOpen(false);
    navigate('/login');
    window.location.reload(); 
  };

  const getDashboardLink = () => {
    if (role === 'owner') return '/dashboard/owner';
    if (role === 'admin') return '/dashboard/admin';
    return '/dashboard/user';
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="absolute inset-0 glass opacity-95"></div>
      <div className="relative max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-petrol-800 to-petrol-600 text-cream-50 shadow-lg shadow-petrol-900/20 group-hover:scale-105 transition-transform duration-300">
            <Waves size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-sans font-bold tracking-tight text-petrol-900 dark:text-cream-50">
            Kinara<span className="text-sunset-500">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-petrol-100 dark:hover:bg-white/10 text-petrol-600 dark:text-cream-100 transition-all">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {token ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white dark:bg-white/10 border border-petrol-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sunset-500 to-orange-400 text-white flex items-center justify-center font-bold text-sm">
                  {role ? role.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-bold text-petrol-700 dark:text-cream-100 capitalize hidden md:block">{role}</span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-lagoon-900 rounded-2xl shadow-xl border border-petrol-100 dark:border-white/10 overflow-hidden animate-fade-in-up origin-top-right">
                  <div className="py-1">
                    <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-petrol-700 dark:text-cream-100 hover:bg-petrol-50 dark:hover:bg-white/5 transition-colors">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border-2 border-sunset-500/20 hover:border-sunset-500 bg-transparent hover:bg-sunset-50 dark:hover:bg-white/5 transition-all group">
              <div className="bg-sunset-100 dark:bg-white/10 p-1 rounded-full text-sunset-600 dark:text-sunset-400">
                <User size={16} />
              </div>
              <span className="text-sm font-bold text-petrol-800 dark:text-cream-50 group-hover:text-sunset-600 dark:group-hover:text-sunset-400 transition-colors">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}