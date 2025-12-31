import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Key, ArrowRight, Loader2, AlertCircle, Mail, Lock, Smile, CheckCircle2, Phone } from 'lucide-react'; // <--- Added Phone
import api from '../api/axios'; 

export default function Signup() {
  const [role, setRole] = useState('user'); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '' // <--- Added this
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = `/auth/${role}/signup`; 
      await api.post(endpoint, formData);
      setSuccess(true);
      setTimeout(() => { navigate('/login'); }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
      setLoading(false);
    }
  };

  const roles = [
    { id: 'user', label: 'Traveler', icon: User },
    { id: 'owner', label: 'Host', icon: Key },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sunset-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-petrol-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-[420px]">
        <div className="relative bg-cream-50 dark:bg-lagoon-900 rounded-[1.9rem] p-8 md:p-10 shadow-2xl border border-white/20 dark:border-white/5">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50 mb-2">Create Account</h2>
              <p className="text-petrol-500 text-sm">Join Kinara as a {role === 'user' ? 'Traveler' : 'Host'}</p>
            </div>

            {/* Role Toggle */}
            <div className="flex bg-petrol-50 dark:bg-lagoon-950 p-1.5 rounded-2xl mb-8 border border-petrol-100 dark:border-white/5 shadow-inner">
              {roles.map((r) => (
                <button key={r.id} onClick={() => setRole(r.id)} className="flex-1 relative z-10 py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
                  {role === r.id && <motion.div layoutId="activeTabSignup" className="absolute inset-0 bg-sunset-500 rounded-xl shadow-lg" />}
                  <r.icon size={16} className={`relative z-10 ${role === r.id ? 'text-white' : 'text-petrol-400'}`} />
                  <span className={`relative z-10 ${role === r.id ? 'text-white' : 'text-petrol-500'}`}>{r.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Name */}
              <div className="space-y-1 group/input">
                <label className="text-xs font-bold text-petrol-400 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <Smile size={18} className="absolute left-4 top-3.5 text-petrol-300" />
                  <input type="text" required className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white dark:bg-lagoon-950 border border-petrol-100 dark:border-white/10 text-petrol-900 dark:text-white outline-none focus:ring-2 focus:ring-sunset-500/50" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 group/input">
                <label className="text-xs font-bold text-petrol-400 uppercase ml-1">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-3.5 text-petrol-300" />
                  <input type="email" required className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white dark:bg-lagoon-950 border border-petrol-100 dark:border-white/10 text-petrol-900 dark:text-white outline-none focus:ring-2 focus:ring-sunset-500/50" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              {/* Phone - NEW FIELD */}
              <div className="space-y-1 group/input">
                <label className="text-xs font-bold text-petrol-400 uppercase ml-1">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-3.5 text-petrol-300" />
                  <input type="tel" required className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white dark:bg-lagoon-950 border border-petrol-100 dark:border-white/10 text-petrol-900 dark:text-white outline-none focus:ring-2 focus:ring-sunset-500/50" placeholder="+91 98765 43210" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
                </div>
              </div>
              
              {/* Password */}
              <div className="space-y-1 group/input">
                <label className="text-xs font-bold text-petrol-400 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-3.5 text-petrol-300" />
                  <input type="password" required minLength={6} className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white dark:bg-lagoon-950 border border-petrol-100 dark:border-white/10 text-petrol-900 dark:text-white outline-none focus:ring-2 focus:ring-sunset-500/50" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <AnimatePresence>
                {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2"><AlertCircle size={16} /> {error}</motion.div>}
                {success && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm border border-green-100 flex items-center gap-2"><CheckCircle2 size={16} /> Account Created!</motion.div>}
              </AnimatePresence>

              {!success && (
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-400 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
                </button>
              )}
            </form>
            
            {!success && (
              <div className="mt-8 text-center text-sm text-petrol-400">
                Already have an account? <Link to="/login" className="font-bold text-petrol-700 dark:text-cream-100 hover:text-sunset-500">Sign In</Link>
              </div>
            )}

          </div>
      </motion.div>
    </div>
  );
}