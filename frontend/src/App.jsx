import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StayDetails from './pages/StayDetails';
import StayCard from './components/StayCard';
import SkeletonCard from './components/SkeletonCard';
import ProtectedRoute from './components/ProtectedRoute'; 
import DashboardLayout from './layouts/DashboardLayout'; 
import OwnerDashboard from './pages/dashboard/OwnerDashboard'; 
import AddStay from './pages/dashboard/AddStay';
import OwnerBookings from './pages/dashboard/OwnerBookings';
import UserDashboard from './pages/dashboard/UserDashboard';
import OwnerStays from './pages/dashboard/OwnerStays';
import EditStay from './pages/dashboard/EditStay';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Signup from './pages/Signup';

import { Search, MapPin, Calendar, ArrowDown } from 'lucide-react';
import api from './api/axios';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const Hero = ({ scrollToListing }) => (
  <div className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sunset-500/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob dark:bg-sunset-500/10"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sunny/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 dark:bg-sunny/10"></div>
    </div>
    <div className="text-center px-4 max-w-5xl mx-auto z-10 mt-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-50/50 dark:bg-white/5 border border-petrol-100 dark:border-white/10 backdrop-blur-sm mb-8 shadow-sm animate-fade-in-up">
        <span className="flex h-2 w-2 rounded-full bg-sunset-500 animate-pulse"></span>
        <span className="text-xs font-bold uppercase tracking-wider text-petrol-800 dark:text-cream-100">Live in Malvan</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-sans font-extrabold mb-6 leading-tight text-petrol-900 dark:text-cream-50 tracking-tight drop-shadow-sm">
        Find your <span className="text-gradient">shoreside</span> <br className="hidden md:block" /> sanctuary.
      </h1>
      <p className="text-lg md:text-xl text-petrol-600 dark:text-cream-200/80 mb-10 max-w-2xl mx-auto font-body leading-relaxed">
        Experience the authentic Konkan coast. Book verified local stays directly from owners.
      </p>
      <button onClick={scrollToListing} className="bg-sunset-500 hover:bg-sunset-600 text-white p-4 md:px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-sunset-500/30 transition-all hover:scale-105 active:scale-95 mt-8">
        <Search size={24} strokeWidth={2.5} />
        <span className="font-bold">Explore Stays</span>
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const res = await api.get('/stays/');
        setStays(res.data);
      } catch (err) {
        console.error("Failed to fetch stays", err);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchStays();
  }, []);

  const listingRef = React.useRef(null);
  const scrollToListing = () => listingRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <Hero scrollToListing={scrollToListing} />
      <div ref={listingRef} className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />) : 
            stays.map((stay, index) => (
              <Link key={stay.id} to={`/stay/${stay.id}`}>
                <StayCard stay={stay} index={index} />
              </Link>
            ))
          }
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stay/:id" element={<StayDetails />} />
        </Route>

        <Route element={<ProtectedRoute />}> 
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="owner" element={<OwnerDashboard />} />
                <Route path="owner/add-stay" element={<AddStay />} />
                <Route path="owner/bookings" element={<OwnerBookings />} />
                <Route path="owner/stays" element={<OwnerStays />} />
                <Route path="owner/edit-stay/:id" element={<EditStay />} />
                <Route path="user" element={<UserDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;