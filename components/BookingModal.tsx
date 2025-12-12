import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Utensils, Home, CheckCircle, Clock, MapPin, Bus, Car, Train, Plane, Ship, Wallet } from 'lucide-react';
import { Attraction, BookingDetails, TransportMode, User } from '../types';

interface Props {
  attraction: Attraction;
  currentUser: User;
  onClose: () => void;
  onConfirm?: (details: BookingDetails, totalCost: number) => void;
  onTransaction: (amount: number, type: 'deposit' | 'payment', description: string) => void;
}

export const BookingModal: React.FC<Props> = ({ attraction, currentUser, onClose, onConfirm, onTransaction }) => {
  const [details, setDetails] = useState<BookingDetails>({
    date: '',
    guests: 2,
    includeTour: true,
    includeFeeding: false,
    nights: 0,
    durationHours: 2,
    transportModes: [TransportMode.Car], // Default
    originCity: ''
  });

  const [total, setTotal] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transportSuggestion, setTransportSuggestion] = useState('');

  useEffect(() => {
    let cost = attraction.pricing.entry * details.guests;
    if (details.includeTour) cost += attraction.pricing.tourGuide;
    if (details.includeFeeding) cost += attraction.pricing.feedingPerDay * details.guests * (details.nights || 1);
    if (details.nights > 0) cost += attraction.pricing.accommodationPerNight * details.nights;
    
    // Extra hours cost
    if (details.durationHours > 4) {
      cost += (details.durationHours - 4) * 10;
    }

    setTotal(Math.floor(cost));
  }, [details, attraction.pricing]);

  // Update payable based on wallet usage
  useEffect(() => {
     if (useWallet) {
        const remaining = total - currentUser.walletBalance;
        setPayableAmount(remaining > 0 ? remaining : 0);
     } else {
        setPayableAmount(total);
     }
  }, [useWallet, total, currentUser.walletBalance]);

  // Logic to suggest transport combinations based on origin
  useEffect(() => {
    if (!details.originCity) {
      setTransportSuggestion('');
      return;
    }

    // Heuristic logic for combinations
    const modes = details.transportModes;
    
    if (modes.includes(TransportMode.Flight) && modes.length === 1) {
       setTransportSuggestion('Flying? You might need a Car or Shuttle for the last mile.');
    } else if (modes.includes(TransportMode.Train) && attraction.category === 'Nature') {
       setTransportSuggestion('Trains are scenic! Ensure there is a station near the park entrance.');
    } else if (modes.length > 2) {
       setTransportSuggestion('Wow, quite the journey! Make sure to leave buffer time for transfers.');
    } else if (modes.length === 0) {
       setTransportSuggestion('Please select at least one mode of transport.');
    } else {
       setTransportSuggestion(`Great choice combining ${modes.join(' & ')}.`);
    }

  }, [details.transportModes, details.originCity, attraction.category]);

  const toggleTransportMode = (mode: TransportMode) => {
     setDetails(prev => {
        const exists = prev.transportModes.includes(mode);
        if (exists) {
           return { ...prev, transportModes: prev.transportModes.filter(m => m !== mode) };
        } else {
           return { ...prev, transportModes: [...prev.transportModes, mode] };
        }
     });
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.transportModes.length === 0) {
       alert('Please select a transportation method.');
       return;
    }

    // Deduct from wallet if used
    if (useWallet) {
       const deduction = Math.min(total, currentUser.walletBalance);
       onTransaction(deduction, 'payment', `Booking: ${attraction.name}`);
    }

    setIsSuccess(true);
    if (onConfirm) onConfirm(details, total);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case TransportMode.Car: return <Car className="h-5 w-5" />;
      case TransportMode.Bus: return <Bus className="h-5 w-5" />;
      case TransportMode.Train: return <Train className="h-5 w-5" />;
      case TransportMode.Flight: return <Plane className="h-5 w-5" />;
      case TransportMode.Boat: return <Ship className="h-5 w-5" />;
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl animate-fade-in">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-2xl font-bold text-gray-800">Booking Confirmed!</h3>
          <p className="text-gray-600">Get ready for {attraction.name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl animate-slide-up overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Summary & Image */}
        <div className="w-full md:w-1/3 bg-gray-50 relative hidden md:block">
           <img src={attraction.imageUrl} alt="" className="h-full w-full object-cover absolute inset-0 opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="font-serif text-2xl font-bold">{attraction.name}</h3>
              <p className="text-sm opacity-90 mb-4">{attraction.location}</p>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-4">
                 <div className="text-xs uppercase tracking-wider opacity-70 mb-1">Max Duration</div>
                 <div className="font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {attraction.maxDurationHours} Hours
                 </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <span className="block text-xs uppercase tracking-wider opacity-70">Total Estimate</span>
                <span className="text-3xl font-bold">${total}</span>
              </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-gray-800">Plan Your Visit</h2>
             <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
               <X className="h-5 w-5 text-gray-500" />
             </button>
          </div>

          <form onSubmit={handleBook} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="date" 
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    onChange={e => setDetails({...details, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="number" 
                    min="1"
                    value={details.guests}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    onChange={e => setDetails({...details, guests: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
            </div>

            {/* Visit Duration */}
            <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100">
               <label className="block text-sm font-bold text-brand-900 mb-3 flex justify-between">
                  <span>Visit Duration</span>
                  <span className="text-brand-600">{details.durationHours} Hours</span>
               </label>
               <input 
                  type="range" 
                  min="1" 
                  max={attraction.maxDurationHours} 
                  step="0.5"
                  value={details.durationHours}
                  onChange={e => setDetails({...details, durationHours: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-brand-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
               />
               <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>1h</span>
                  <span className="font-medium text-red-400">Limit: {attraction.maxDurationHours}h</span>
               </div>
            </div>

            {/* Transportation Planner */}
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <h4 className="font-bold text-gray-800 text-sm">Transportation Chain</h4>
                 <span className="text-xs text-gray-400">Select multiple if needed</span>
               </div>
               
               <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Origin City</label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                     <input 
                        type="text"
                        placeholder="e.g. London"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        value={details.originCity}
                        onChange={e => setDetails({...details, originCity: e.target.value})}
                     />
                  </div>
               </div>
               
               <div className="flex flex-wrap gap-2">
                  {Object.values(TransportMode).map(mode => {
                     const isSelected = details.transportModes.includes(mode);
                     return (
                        <button
                           key={mode}
                           type="button"
                           onClick={() => toggleTransportMode(mode)}
                           className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                              isSelected 
                              ? 'bg-brand-900 text-white border-brand-900 shadow-md transform scale-105' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                           }`}
                        >
                           {getTransportIcon(mode)}
                           {mode}
                        </button>
                     );
                  })}
               </div>

               {transportSuggestion && (
                  <div className="flex items-start gap-2 bg-accent-50 p-3 rounded-xl text-xs text-accent-800 animate-fade-in border border-accent-100">
                     <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                     <p>{transportSuggestion}</p>
                  </div>
               )}
            </div>

            {/* Payment & Wallet */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
               <h4 className="font-bold text-gray-800 text-sm mb-3">Payment Details</h4>
               
               <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full ${currentUser.walletBalance > 0 ? 'bg-brand-100 text-brand-600' : 'bg-gray-200 text-gray-400'}`}>
                        <Wallet className="h-5 w-5" />
                     </div>
                     <div>
                        <div className="text-sm font-semibold text-gray-900">Use Travel Fund</div>
                        <div className="text-xs text-gray-500">Balance: ${currentUser.walletBalance}</div>
                     </div>
                  </div>
                  <input 
                     type="checkbox" 
                     disabled={currentUser.walletBalance <= 0}
                     checked={useWallet}
                     onChange={(e) => setUseWallet(e.target.checked)}
                     className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                  />
               </label>
            </div>

            <div className="md:hidden pt-4 border-t">
               <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-brand-600">${total}</span>
               </div>
            </div>

            <button 
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-brand-700 active:scale-95 flex items-center justify-center justify-between px-6"
            >
              <span>Confirm Booking</span>
              <span>
                 {useWallet && payableAmount < total && <span className="text-white/60 line-through text-sm mr-2">${total}</span>}
                 ${payableAmount}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};