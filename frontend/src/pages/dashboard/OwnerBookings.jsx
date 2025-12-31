import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Loader2, User, Check, X, AlertCircle, Phone, Mail } from 'lucide-react';
import api from '../../api/axios';

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/owner-requests');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id, action) => {
    if(!confirm(`Are you sure you want to ${action} this booking?`)) return;
    try {
      await api.post(`/bookings/${id}/action`, { action });
      fetchBookings(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.detail || "Action failed");
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50">Booking Requests</h1>
        <p className="text-petrol-500">Manage incoming reservations for your stays.</p>
      </div>

      <div className="bg-white dark:bg-lagoon-800 rounded-3xl border border-petrol-100 dark:border-white/5 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-petrol-50 dark:bg-white/5 text-xs font-bold text-petrol-500 uppercase">
            <tr>
              <th className="p-6">Guest Details</th>
              <th className="p-6">Dates & Guests</th> {/* Updated Header */}
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-petrol-100 dark:divide-white/5 text-sm text-petrol-700 dark:text-cream-100">
            {bookings.length > 0 ? bookings.map(booking => (
              <tr key={booking.id}>
                {/* GUEST INFO */}
                <td className="p-6">
                  <div className="font-bold text-lg mb-1">{booking.user?.name || "Unknown Guest"}</div>
                  <div className="text-xs text-petrol-500">
                    <div>{booking.user?.phone_number}</div>
                    <div>{booking.user?.email}</div>
                    <div className="mt-1 text-petrol-400">Stay ID: {booking.stay_id}</div>
                  </div>
                </td>

                {/* DATES & GUEST COUNT (FIXED) */}
                <td className="p-6">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar size={14} />
                        {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-petrol-500">
                        <User size={14} />
                        {booking.guests} Guests  {/* <--- Added This */}
                      </div>
                   </div>
                </td>

                {/* STATUS */}
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-max items-center gap-1 ${
                    booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                    booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {booking.status === 'ACCEPTED' && <CheckCircle size={12}/>}
                    {booking.status === 'REJECTED' && <XCircle size={12}/>}
                    {booking.status === 'REQUESTED' && <Clock size={12}/>}
                    {booking.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-6 text-right">
                  {booking.status === 'REQUESTED' ? (
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => handleAction(booking.id, 'reject')}
                         className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-200"
                       >
                         <XCircle size={20} />
                       </button>
                       <button 
                         onClick={() => handleAction(booking.id, 'accept')}
                         className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-2 shadow-sm"
                       >
                         <CheckCircle size={16} /> Accept
                       </button>
                    </div>
                  ) : (
                    <span className="text-petrol-400 text-xs italic">Action Completed</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="p-10 text-center">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}