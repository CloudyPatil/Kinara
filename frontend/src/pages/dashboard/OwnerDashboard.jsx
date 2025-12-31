import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import { DollarSign, Home, Calendar, TrendingUp, Loader2, ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../api/axios';
import { format } from 'date-fns';

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    activeStays: 0,
    pendingRequests: 0,
    occupancy: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch My Stays (To count active properties)
        // Note: Currently we fetch all and filter. 
        // In a V2 backend, we would have /stays/me
        const staysRes = await api.get('/stays/');
        
        // 2. Fetch My Booking Requests (The Money & Action items)
        const bookingsRes = await api.get('/bookings/owner-requests');

        // --- THE MATH ENGINE ---
        
        // A. Filter stays belonging to this logged-in owner
        // (We decoded the token in Login, but let's assume for now 
        // we check if the stay owner_id matches. Since we don't have ID in localstorage easily,
        // we will rely on the bookings count for logic or just count the public stays for now as a proxy
        // until we add a specific endpoint. 
        // *For this demo, we will use the bookings length to estimate activity*)
        
        // Let's rely on the Bookings endpoint which IS secured by token
        const myBookings = bookingsRes.data;

        // B. Calculate Revenue (Sum of ACCEPTED bookings)
        // Assuming booking object has stay_price (if not, we estimate or need backend update)
        // For now, let's assume an average price if not provided, or count accepted bookings
        const accepted = myBookings.filter(b => b.status === 'ACCEPTED');
        const revenue = accepted.length * 3500; // Mock calculation: ₹3500 avg per booking
        // REAL WORLD: You would do: b.total_price (needs backend update to send price)

        // C. Count Pending
        const pending = myBookings.filter(b => b.status === 'REQUESTED');

        setStats({
          revenue: revenue,
          activeStays: 6, // Hardcoded for now until we add /stays/me endpoint
          pendingRequests: pending.length,
          occupancy: Math.round((accepted.length / (myBookings.length || 1)) * 100)
        });

        setRecentBookings(myBookings.slice(0, 5)); // Show top 5
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-petrol-500">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50">Dashboard Overview</h1>
        <p className="text-petrol-500 dark:text-petrol-400">Real-time insights for your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="green" 
        />
        <StatCard 
          title="Active Stays" 
          value={stats.activeStays} 
          icon={Home} 
          color="blue" 
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests} 
          icon={Calendar} 
          color="orange" 
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats.occupancy}%`} 
          icon={TrendingUp} 
          color="purple" 
        />
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-white dark:bg-lagoon-800 rounded-3xl p-8 border border-petrol-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-petrol-900 dark:text-cream-50">Recent Bookings</h2>
          <button className="text-sm font-bold text-sunset-500 hover:text-sunset-600">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-petrol-400 uppercase tracking-wider border-b border-petrol-100 dark:border-white/10">
                <th className="pb-4 pl-2">Guest</th>
                <th className="pb-4">Dates</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-petrol-700 dark:text-cream-100">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-petrol-50 dark:hover:bg-white/5 transition-colors border-b border-petrol-50 dark:border-white/5 last:border-0">
                    
                    {/* Guest Column */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-petrol-400 to-petrol-600 text-white flex items-center justify-center text-xs font-bold">
                          User
                        </div>
                        <div>
                          <div className="text-petrol-900 dark:text-white font-bold">Guest #{booking.user_id}</div>
                          <div className="text-xs text-petrol-400">ID: {booking.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Dates Column */}
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span>{format(new Date(booking.check_in), 'MMM dd')} - {format(new Date(booking.check_out), 'MMM dd, yyyy')}</span>
                        <span className="text-xs text-petrol-400">2 Nights</span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        booking.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/20' :
                        booking.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/20' :
                        'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-500/20'
                      }`}>
                        {booking.status === 'ACCEPTED' && <CheckCircle size={12} />}
                        {booking.status === 'REJECTED' && <XCircle size={12} />}
                        {booking.status === 'REQUESTED' && <Clock size={12} />}
                        {booking.status}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="py-4 text-right pr-2">
                       <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors text-petrol-400 hover:text-sunset-500">
                          <ArrowUpRight size={18} />
                       </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-petrol-400">
                    No bookings found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}