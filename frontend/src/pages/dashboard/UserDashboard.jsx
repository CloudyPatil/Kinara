import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, MapPin, Loader2, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        // Sort newest first
        setBookings(res.data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-petrol-500" /></div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50">My Trips</h1>
        <p className="text-petrol-500 dark:text-petrol-400">Track the status of your requested stays.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white dark:bg-lagoon-800 rounded-3xl p-6 border border-petrol-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-shadow">
            
            {/* Header: Status */}
            <div className="flex justify-between items-start mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                booking.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200' :
                booking.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                {booking.status === 'ACCEPTED' && <CheckCircle size={12} />}
                {booking.status === 'REJECTED' && <XCircle size={12} />}
                {booking.status === 'REQUESTED' && <Clock size={12} />}
                {booking.status}
              </span>
              <span className="text-xs text-petrol-400 font-mono">#{booking.id}</span>
            </div>

            {/* Stay Details */}
            <div className="mb-4">
               <h3 className="font-bold text-lg text-petrol-900 dark:text-white">Stay ID: {booking.stay_id}</h3>
               {/* In a real app, we would fetch the Stay Name here using the ID */}
               <div className="flex items-center gap-1 text-sm text-petrol-500 mt-1">
                 <MapPin size={14} />
                 <span>Malvan, Maharashtra</span>
               </div>
            </div>

            {/* Dates */}
            <div className="bg-petrol-50 dark:bg-white/5 p-4 rounded-2xl mb-4">
               <div className="flex justify-between items-center text-sm">
                 <div>
                    <div className="text-xs font-bold text-petrol-400 uppercase">Check-in</div>
                    <div className="font-bold text-petrol-800 dark:text-cream-100">{format(new Date(booking.check_in), 'MMM dd')}</div>
                 </div>
                 <ArrowRight size={16} className="text-petrol-300" />
                 <div className="text-right">
                    <div className="text-xs font-bold text-petrol-400 uppercase">Check-out</div>
                    <div className="font-bold text-petrol-800 dark:text-cream-100">{format(new Date(booking.check_out), 'MMM dd')}</div>
                 </div>
               </div>
            </div>

            {/* Action / Message */}
            <div>
              {booking.status === 'ACCEPTED' ? (
                <button className="w-full py-2.5 rounded-xl bg-petrol-900 text-white text-sm font-bold shadow-lg shadow-petrol-900/20">
                  View Receipt
                </button>
              ) : booking.status === 'REJECTED' ? (
                <div className="text-xs text-red-500 text-center font-medium">
                  Host is unavailable for these dates.
                </div>
              ) : (
                <div className="text-xs text-orange-500 text-center font-medium">
                  Waiting for host approval...
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}