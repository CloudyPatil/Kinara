import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Key, Shield, ArrowRight, Loader2, AlertCircle, Mail, Lock, CheckCircle2 } from 'lucide-react';
import api from '../api/axios'; 

export default function Login() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = `/auth/${role}/login`; 
      const res = await api.post(endpoint, { email, password });
      
      // 1. Save Token & Role
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      
      const userRole = res.data.role;

      // 2. Show Success Message
      setSuccess(`Welcome back! Redirecting to ${userRole === 'user' ? 'home' : 'dashboard'}...`);
      
      // 3. Redirect based on Role after 1.5 seconds
      setTimeout(() => {
        if (userRole === 'owner') {
          navigate('/dashboard/owner');
        } else if (userRole === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/');
        }
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  const roles = [
    { id: 'user', label: 'Traveler', icon: User },
    { id: 'owner', label: 'Host', icon: Key },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 px-4">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sunset-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-petrol-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative w-full max-w-[420px]"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sunset-500 to-petrol-500 rounded-[2rem] opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
          
          <div className="relative bg-cream-50 dark:bg-lagoon-900 rounded-[1.9rem] p-8 md:p-10 shadow-2xl shadow-black/20 border border-white/20 dark:border-white/5">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50 mb-2 tracking-tight">
                Welcome back
              </h2>
              <p className="text-petrol-500 dark:text-petrol-300/70 font-body text-sm">
                Access your {role === 'user' ? 'journeys' : role === 'owner' ? 'properties' : 'dashboard'}
              </p>
            </div>

            {/* ROLE TOGGLE */}
            <div className="flex bg-petrol-50 dark:bg-lagoon-950 p-1.5 rounded-2xl mb-8 border border-petrol-100 dark:border-white/5 shadow-inner">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className="flex-1 relative z-10 py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn"
                  disabled={loading || success}
                >
                  {role === r.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-sunset-500 rounded-xl shadow-lg shadow-sunset-500/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <r.icon 
                    size={16} 
                    className={`relative z-10 transition-colors duration-300 ${
                      role === r.id ? 'text-white' : 'text-petrol-400 dark:text-petrol-500'
                    }`} 
                  />
                  <span className={`relative z-10 transition-colors duration-300 ${
                    role === r.id ? 'text-white' : 'text-petrol-500 dark:text-petrol-400'
                  }`}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-1 group/input">
                <label className="text-xs font-bold text-petrol-400 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-petrol-300 group-focus-within/input:text-sunset-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={loading || success}
                    className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white dark:bg-lagoon-950 border border-petrol-100 dark:border-white/10 text-petrol-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sunset-500/50 transition-all font-medium disabled:opacity-50"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-1 group/input">
                <label className="text-xs font-bold text-petrol-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-petrol-300 group-focus-within/input:text-sunset-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    disabled={loading || success}
                    className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white dark:bg-lagoon-950 border border-petrol-100 dark:border-white/10 text-petrol-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sunset-500/50 transition-all font-medium disabled:opacity-50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* MESSAGES AREA */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100 dark:border-red-500/20"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold border border-green-100 dark:border-green-500/20 shadow-sm"
                  >
                    <CheckCircle2 size={22} className="text-green-600 dark:text-green-400" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {!success && (
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-400 hover:to-sunset-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sunset-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span className="text-base">Sign In</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              )}
            </form>
            
            {!success && (
              <div className="mt-8 text-center">
                <p className="text-petrol-400 dark:text-petrol-500 text-sm">
                  New to Kinara?{' '}
                  <Link to="/signup" className="font-bold text-petrol-700 dark:text-cream-100 hover:text-sunset-500 dark:hover:text-sunset-400 transition-colors">
                    Create an account
                  </Link>
                </p>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}