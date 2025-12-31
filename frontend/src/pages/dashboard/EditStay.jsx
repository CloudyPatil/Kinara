import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, MapPin, DollarSign, FileText, Check, Loader2, Save, UploadCloud, X } from 'lucide-react';
import api from '../../api/axios';

export default function EditStay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price_per_night: '',
    image_url: '',
    images: [], // List for gallery
    facilities: [] 
  });

  const amenitiesList = ["Wifi", "AC", "Pool", "Parking", "Kitchen", "Beach View", "Breakfast"];

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchStay = async () => {
      try {
        const res = await api.get(`/stays/${id}`);
        // Ensure images is an array (even if backend sends null)
        const existingImages = res.data.images || [];
        // If legacy stay has image_url but empty images list, fix it
        if (res.data.image_url && existingImages.length === 0) {
            existingImages.push(res.data.image_url);
        }

        setFormData({
            ...res.data,
            images: existingImages
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load property details.");
        navigate('/dashboard/owner/stays');
      } finally {
        setLoading(false);
      }
    };
    fetchStay();
  }, [id, navigate]);

  // --- IMAGE UPLOAD LOGIC (Same as AddStay) ---
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newUrls = [];

    try {
      await Promise.all(files.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        const res = await api.post('/utils/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        newUrls.push(res.data.url);
      }));

      setFormData(prev => {
        const updatedImages = [...prev.images, ...newUrls];
        return {
          ...prev,
          images: updatedImages,
          image_url: prev.image_url || updatedImages[0]
        };
      });
    } catch (err) {
      console.error(err);
      alert("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (urlToRemove) => {
    setFormData(prev => {
      const filtered = prev.images.filter(url => url !== urlToRemove);
      return {
        ...prev,
        images: filtered,
        // If we deleted the main image, set new main image to first available
        image_url: prev.image_url === urlToRemove ? (filtered[0] || '') : prev.image_url
      };
    });
  };

  const setMainImage = (url) => {
    setFormData({ ...formData, image_url: url });
  };
  // --------------------------------------------

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      if (prev.facilities.includes(amenity)) {
        return { ...prev, facilities: prev.facilities.filter(a => a !== amenity) };
      } else {
        return { ...prev, facilities: [...prev.facilities, amenity] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/stays/${id}`, formData);
      alert("Property Updated Successfully!");
      navigate('/dashboard/owner/stays');
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-sans font-bold text-petrol-900 dark:text-cream-50">Edit Property</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-lagoon-800 rounded-3xl p-8 border border-petrol-100 dark:border-white/5 shadow-sm space-y-6">
        
        {/* Name & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-petrol-500 uppercase">Property Name</label>
            <div className="relative">
               <Home size={18} className="absolute left-4 top-3.5 text-petrol-400" />
               <input 
                 type="text" required
                 className="w-full pl-11 pr-4 py-3 rounded-xl bg-petrol-50 dark:bg-white/5 border-transparent outline-none text-petrol-900 dark:text-white"
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
               />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-petrol-500 uppercase">Location</label>
            <div className="relative">
               <MapPin size={18} className="absolute left-4 top-3.5 text-petrol-400" />
               <input 
                 type="text" required
                 className="w-full pl-11 pr-4 py-3 rounded-xl bg-petrol-50 dark:bg-white/5 border-transparent outline-none text-petrol-900 dark:text-white"
                 value={formData.location}
                 onChange={e => setFormData({...formData, location: e.target.value})}
               />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-petrol-500 uppercase">Price (₹)</label>
            <div className="relative">
               <DollarSign size={18} className="absolute left-4 top-3.5 text-petrol-400" />
               <input 
                   type="number" required
                   className="w-full pl-11 pr-4 py-3 rounded-xl bg-petrol-50 dark:bg-white/5 border-transparent outline-none text-petrol-900 dark:text-white"
                   value={formData.price_per_night}
                   onChange={e => setFormData({...formData, price_per_night: e.target.value})}
               />
            </div>
        </div>

        {/* --- MULTI IMAGE UPLOAD SECTION --- */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-petrol-500 uppercase">Property Images</label>
          
          <div className="relative border-2 border-dashed border-petrol-200 dark:border-white/10 rounded-2xl p-6 text-center hover:bg-petrol-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <input 
              type="file" accept="image/*" multiple 
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={uploading}
            />
            <div className="flex flex-col items-center gap-2 text-petrol-400 group-hover:text-sunset-500 transition-colors">
              {uploading ? <Loader2 size={32} className="animate-spin text-sunset-500" /> : <UploadCloud size={32} />}
              <span className="text-sm font-bold text-petrol-600 dark:text-cream-50">
                {uploading ? "Uploading..." : "Click to Upload New Photos"}
              </span>
            </div>
          </div>

          {/* Gallery Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.images.map((url, index) => (
                <div key={index} className={`relative h-24 rounded-xl overflow-hidden group border-2 ${formData.image_url === url ? 'border-sunset-500' : 'border-transparent'}`}>
                  <img 
                    src={url} 
                    alt={`Upload ${index}`} 
                    className="w-full h-full object-cover cursor-pointer" 
                    onClick={() => setMainImage(url)}
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  {formData.image_url === url && (
                    <div className="absolute bottom-0 w-full bg-sunset-500 text-white text-[10px] text-center font-bold py-0.5">
                      Main Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description & Amenities */}
        <div className="space-y-2">
           <label className="text-xs font-bold text-petrol-500 uppercase">Description</label>
           <textarea 
             required rows="3"
             className="w-full px-4 py-3 rounded-xl bg-petrol-50 dark:bg-white/5 border-transparent outline-none text-petrol-900 dark:text-white"
             value={formData.description}
             onChange={e => setFormData({...formData, description: e.target.value})}
           />
        </div>

        <div className="space-y-3">
           <label className="text-xs font-bold text-petrol-500 uppercase">Amenities</label>
           <div className="flex flex-wrap gap-3">
             {amenitiesList.map(item => {
               const isSelected = formData.facilities.includes(item);
               return (
                 <button
                   key={item}
                   type="button"
                   onClick={() => toggleAmenity(item)}
                   className={`px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${
                     isSelected 
                       ? 'bg-petrol-900 text-white border-petrol-900 dark:bg-cream-50 dark:text-petrol-900' 
                       : 'bg-transparent text-petrol-500 border-petrol-200 dark:border-white/10 hover:border-petrol-400'
                   }`}
                 >
                   {isSelected && <Check size={14} />}
                   {item}
                 </button>
               )
             })}
           </div>
        </div>

        <button 
           type="submit" 
           disabled={submitting}
           className="w-full bg-sunset-500 hover:bg-sunset-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sunset-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
        </button>

      </form>
    </div>
  );
}