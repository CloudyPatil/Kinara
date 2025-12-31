import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import { MapPin, Wifi, Wind, Waves, Star, User, X, Phone, Clock, Trash2 } from 'lucide-react';

export default function StayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchStay = async () => {
      try {
        const res = await api.get(`/stays/${id}`);
        setStay(res.data);
      } catch (err) {
        console.error("Failed to fetch stay", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStay();
  }, [id]);

  const handleDelete = async () => {
    if(!confirm("Are you sure you want to delete this stay? This will delete all bookings associated with it.")) return;
    try {
      await api.delete(`/stays/${stay.id}`);
      alert("Stay Deleted Successfully");
      navigate('/dashboard/owner');
    } catch (err) {
      alert("Failed to delete stay");
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    setBookingLoading(true);
    try {
      await api.post('/bookings/', {
        stay_id: stay.id,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        guests: Number(guests)
      });
      alert("Request Sent! 🎉");
      navigate('/dashboard/user');
    } catch (err) {
      alert(err.response?.data?.detail || "Booking Failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!stay) return <div className="p-10 text-center">Stay not found.</div>;

  // --- LOGIC: Check Permissions ---
  const isOwnerRole = user?.role === 'owner'; // Is the viewer ANY owner?
  const isMyStay = isOwnerRole && String(user?.id) === String(stay.owner_id); // Is this MY stay?

  // --- LIGHTBOX ---
  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto animate-fade-in p-4">
        <button onClick={() => setShowAllPhotos(false)} className="fixed top-5 right-5 text-white bg-white/20 p-2 rounded-full"><X/></button>
        <div className="flex flex-col gap-4 max-w-4xl mx-auto mt-10">
            {stay.images?.map((img, i) => (
                <img key={i} src={img} className="w-full rounded-lg" />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in-up pb-24">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-start">
        <div>
            <h1 className="text-3xl md:text-4xl font-sans font-bold text-petrol-900 dark:text-cream-50 mb-2">
            {stay.name}
            </h1>
            <div className="flex items-center gap-2 text-petrol-600 dark:text-cream-200">
            <MapPin size={18} />
            <span>{stay.location}</span>
            </div>
        </div>
        
        {/* DELETE BUTTON (Only visible if it is YOUR stay) */}
        {isMyStay && (
             <button onClick={handleDelete} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 flex items-center gap-2 font-bold transition">
                 <Trash2 size={18} /> Delete Property
             </button>
        )}
      </div>

      {/* IMAGES */}
      <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[450px] mb-8">
        <div className="md:col-span-2 h-full"><img src={stay.image_url} className="w-full h-full object-cover cursor-pointer hover:opacity-90" onClick={() => setShowAllPhotos(true)}/></div>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
            {stay.images?.slice(0,4).map((img, i) => <img key={i} src={img} className="w-full h-full object-cover cursor-pointer hover:opacity-90" onClick={() => setShowAllPhotos(true)}/>)}
        </div>
        <button onClick={() => setShowAllPhotos(true)} className="absolute bottom-4 right-4 bg-black px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:scale-105 transition">Show all photos</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
            <div className="flex justify-between items-center border-b border-petrol-100 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">Hosted by {stay.owner?.name}</h2>
                    <p className="text-petrol-500 text-sm mt-1 flex items-center gap-2"><Phone size={14} /> {stay.owner?.phone_number}</p>
                </div>
                <div className="bg-petrol-100 dark:bg-petrol-800 p-3 rounded-full text-petrol-600 dark:text-cream-100"><User size={24} /></div>
            </div>
            <div>
                <h3 className="text-lg font-bold mb-3">About</h3>
                <p className="text-petrol-600 dark:text-cream-200 leading-relaxed">{stay.description}</p>
            </div>
            <div>
                <h3 className="text-lg font-bold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                    {stay.facilities?.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-petrol-600 dark:text-cream-200"><CheckIcon name={amenity} /><span>{amenity}</span></div>
                    ))}
                </div>
            </div>
        </div>

        {/* BOOKING CARD */}
        <div>
            {!isOwnerRole ? (
            <div className="sticky top-24 bg-white dark:bg-lagoon-800 border border-petrol-100 dark:border-white/5 shadow-xl rounded-2xl p-6">
                <div className="flex justify-between items-end mb-6">
                    <span className="text-2xl font-bold">₹{stay.price_per_night}</span>
                    <span className="text-sm text-petrol-500 mb-1">/ night</span>
                </div>
                <div className="mb-4 bg-petrol-50 dark:bg-white/5 p-3 rounded-lg text-xs text-petrol-600 flex justify-between">
                   <span className="flex items-center gap-1"><Clock size={12}/> In: 02:00 PM</span>
                   <span className="flex items-center gap-1"><Clock size={12}/> Out: 11:00 AM</span>
                </div>
                <form onSubmit={handleBook} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="border border-petrol-200 rounded-xl p-3">
                            <label className="block text-xs font-bold uppercase text-petrol-500 mb-1">Check-In</label>
                            <input type="date" required className="w-full text-sm outline-none bg-transparent" onChange={(e) => setDates({...dates, checkIn: e.target.value})}/>
                        </div>
                        <div className="border border-petrol-200 rounded-xl p-3">
                            <label className="block text-xs font-bold uppercase text-petrol-500 mb-1">Check-Out</label>
                            <input type="date" required className="w-full text-sm outline-none bg-transparent" onChange={(e) => setDates({...dates, checkOut: e.target.value})}/>
                        </div>
                    </div>
                    <div className="border border-petrol-200 rounded-xl p-3">
                        <label className="block text-xs font-bold uppercase text-petrol-500 mb-1">Guests</label>
                        <select className="w-full text-sm outline-none bg-transparent" value={guests} onChange={(e) => setGuests(e.target.value)}>
                            {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num} Guests</option>)}
                        </select>
                    </div>
                    <button type="submit" disabled={bookingLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50">
                        {bookingLoading ? 'Requesting...' : 'Reserve'}
                    </button>
                </form>
                <p className="text-xs text-center text-petrol-400 mt-4">You won't be charged yet</p>
            </div>
            ) : (
                <div className="bg-petrol-50 dark:bg-white/5 p-6 rounded-xl text-center border border-petrol-200 dark:border-white/10">
                    <h3 className="font-bold text-petrol-900 dark:text-white">Host View</h3>
                    <p className="text-sm text-petrol-500 mt-2">
                        {isMyStay 
                            ? "This is your property. You can delete it using the button above." 
                            : "You are logged in as a Host. Please switch to a Traveler account to book stays."}
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ name }) {
    if (name === 'Wifi') return <Wifi size={20} />;
    if (name === 'AC') return <Wind size={20} />;
    if (name === 'Pool') return <Waves size={20} />;
    return <Star size={20} />;
}