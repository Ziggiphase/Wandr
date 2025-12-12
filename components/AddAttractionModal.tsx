import React, { useState } from 'react';
import { X, MapPin, DollarSign, Image as ImageIcon, AlignLeft } from 'lucide-react';
import { Attraction, AttractionCategory, Pricing } from '../types';

interface Props {
  onClose: () => void;
  onAdd: (attraction: Attraction) => void;
}

export const AddAttractionModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    category: AttractionCategory.Nature,
    imageUrl: '',
    entryPrice: 0,
    tourPrice: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAttraction: Attraction = {
      id: `attr_${Date.now()}`,
      name: formData.name,
      location: formData.location,
      description: formData.description,
      category: formData.category,
      rating: 5.0, // New items start with 5 stars
      reviewsCount: 0,
      imageUrl: formData.imageUrl || 'https://picsum.photos/800/600', // Fallback
      images: [formData.imageUrl || 'https://picsum.photos/800/600'],
      pricing: {
        entry: Number(formData.entryPrice),
        tourGuide: Number(formData.tourPrice),
        feedingPerDay: 20, // defaults
        accommodationPerNight: 100 // defaults
      },
      // New fields defaults
      maxDurationHours: 4,
      currentVisitors: 0,
      avgVisitDuration: 0,
      capacity: 500
    };

    onAdd(newAttraction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="bg-brand-50 px-8 py-6 border-b border-brand-100 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-900">List a Destination</h2>
            <p className="text-sm text-brand-900/60">Share a new hidden gem with the Wandr community</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-brand-900/60 hover:text-brand-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-900">Attraction Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. The Azure Grotto"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-900">Category</label>
                <select 
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-brand-500 transition-all"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as AttractionCategory})}
                >
                  {Object.values(AttractionCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                  required
                  type="text" 
                  placeholder="City, Country"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <textarea 
                  required
                  rows={3}
                  placeholder="Describe the experience..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-2xl bg-brand-50 p-6 border border-brand-100">
               <h3 className="font-serif text-lg font-bold text-brand-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" /> Pricing Configuration
               </h3>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-900/80">Entry Fee ($)</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2 outline-none focus:border-brand-500"
                      value={formData.entryPrice}
                      onChange={e => setFormData({...formData, entryPrice: Number(e.target.value)})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-900/80">Guided Tour ($)</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2 outline-none focus:border-brand-500"
                      value={formData.tourPrice}
                      onChange={e => setFormData({...formData, tourPrice: Number(e.target.value)})}
                    />
                 </div>
               </div>
            </div>

          </div>

          <div className="mt-8 flex gap-4">
             <button 
                type="button" 
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
             >
               Cancel
             </button>
             <button 
                type="submit" 
                className="flex-[2] rounded-xl bg-brand-600 py-3 font-bold text-white shadow-lg hover:bg-brand-700 transition-all hover:scale-[1.02]"
             >
               Publish Destination
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};