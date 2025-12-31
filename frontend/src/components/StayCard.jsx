import React from 'react';
import { MapPin, Wifi, Car, Coffee, Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StayCard({ stay, index }) {
  const getIcon = (facility) => {
    const lower = facility.toLowerCase();
    if (lower.includes('wifi')) return <Wifi size={12} />;
    if (lower.includes('park')) return <Car size={12} />;
    if (lower.includes('breakfast')) return <Coffee size={12} />;
    return <Star size={12} />;
  };

  // High-Quality Fallback Images based on ID (to keep them consistent)
  const image = stay.image_url || `https://images.unsplash.com/photo-${
    [
      '1499793983690-e29da59ef1c2', // Beach House
      '1520250497591-112f2f40a3f4', // Resort
      '1510798831971-661eb04b3739', // Cabin
      '1570213489059-0aac66260652', // Cottage
      '1476514525535-07fb3b4ae5f1'  // Swiss
    ][stay.id % 5]
  }?q=80&w=800&auto=format&fit=crop`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-lagoon-900 rounded-[2rem] p-3 border border-petrol-100 dark:border-white/5 
      shadow-sm transition-all duration-500 
      hover:-translate-y-2 
      hover:shadow-[0_20px_50px_-12px_rgba(254,127,45,0.2)] dark:hover:shadow-[0_20px_50px_-12px_rgba(35,61,77,0.4)]"
    >
      
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-petrol-900/0 group-hover:bg-petrol-900/10 transition-colors z-10 duration-500"></div>
        
        <img 
          src={image} 
          alt={stay.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Floating Price Tag */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full glass bg-white/90 dark:bg-lagoon-900/90 text-petrol-900 dark:text-cream-50 text-xs font-bold shadow-lg">
          <span className="text-sunset-500">₹{stay.price_per_night}</span>
          <span className="text-petrol-400 font-medium">/ night</span>
        </div>

        {/* Action Button (Scales up on hover) */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 scale-90 group-hover:scale-100">
          <button className="p-2.5 bg-white rounded-full shadow-xl text-petrol-900 hover:text-sunset-500 transition-colors">
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-5 px-2 mb-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-sans font-bold text-lg text-petrol-900 dark:text-cream-50 leading-tight group-hover:text-sunset-500 transition-colors">
            {stay.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-petrol-600 dark:text-petrol-300 bg-petrol-50 dark:bg-white/5 px-2 py-1 rounded-md">
            <Star size={10} className="fill-sunset-400 text-sunset-400" />
            <span>4.9</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-petrol-400 dark:text-petrol-500 text-sm font-medium">
          <MapPin size={14} />
          <span>{stay.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {stay.facilities?.slice(0, 3).map((fac, i) => (
            <span 
              key={i} 
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-petrol-50 dark:bg-white/5 text-petrol-600 dark:text-petrol-300 border border-petrol-100 dark:border-white/5"
            >
              {getIcon(fac)}
              {fac}
            </span>
          ))}
          {(stay.facilities?.length || 0) > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-petrol-50 text-petrol-400">
              +{stay.facilities.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}