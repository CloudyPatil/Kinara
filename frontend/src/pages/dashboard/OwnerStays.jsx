import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, MapPin, DollarSign, Plus, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function OwnerStays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stays (Ideally filtered by owner on backend, 
  // but for now we fetch all and let the user manage what they see)
  useEffect(() => {
    const fetchStays = async () => {
      try {
        const res = await api.get('/stays/');
        // In a real production app, we would use an endpoint like /stays/me
        // For this demo, we assume the owner sees what they created.
        setStays(res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property? This cannot be undone.")) return;

    try {
      // NOTE: We need to implement DELETE in backend to make this fully work,
      // But here is the frontend logic:
      await api.delete(`/stays/${id}`); 
      setStays(stays.filter(stay => stay.id !== id));
      alert("Property deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete. (Did you implement the DELETE endpoint in FastAPI?)");
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-petrol-500" /></div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50">My Properties</h1>
          <p className="text-petrol-500 dark:text-petrol-400">Manage your active listings.</p>
        </div>
        <Link to="/dashboard/owner/add-stay" className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-sunset-500/30">
          <Plus size={18} /> Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stays.map(stay => (
          <div key={stay.id} className="bg-white dark:bg-lagoon-800 rounded-3xl p-4 border border-petrol-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all group">
            
            {/* Image */}
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
               <img src={stay.image_url || "https://source.unsplash.com/random/400x300/?house"} alt={stay.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-2 right-2 bg-white/90 text-petrol-900 text-xs font-bold px-2 py-1 rounded-lg">
                 ID: {stay.id}
               </div>
            </div>

            {/* Details */}
            <div className="px-2">
              <h3 className="font-bold text-lg text-petrol-900 dark:text-white truncate">{stay.name}</h3>
              <div className="flex items-center gap-1 text-sm text-petrol-500 mt-1">
                 <MapPin size={14} /> {stay.location}
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-sunset-500 mt-2">
                 <DollarSign size={14} /> ₹{stay.price_per_night} / night
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-petrol-100 dark:border-white/10">
              <Link 
                to={`/dashboard/owner/edit-stay/${stay.id}`}
                className="flex-1 py-2 rounded-xl border border-petrol-200 dark:border-white/10 text-petrol-600 dark:text-cream-100 font-bold text-sm flex items-center justify-center gap-2 hover:bg-petrol-50 dark:hover:bg-white/5 transition-colors"
              >
                <Edit2 size={16} /> Edit
              </Link>
              <button 
                onClick={() => handleDelete(stay.id)}
                className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}