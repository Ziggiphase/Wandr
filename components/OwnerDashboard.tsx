import React, { useState } from 'react';
import { Users, Clock, TrendingUp, AlertCircle, Settings, ChevronLeft, Save } from 'lucide-react';
import { Attraction } from '../types';

interface Props {
  attraction: Attraction;
  onUpdate: (attr: Attraction) => void;
  onExit: () => void;
}

export const OwnerDashboard: React.FC<Props> = ({ attraction, onUpdate, onExit }) => {
  const [maxDuration, setMaxDuration] = useState(attraction.maxDurationHours);
  const [simulatedVisitors, setSimulatedVisitors] = useState(attraction.currentVisitors);

  const capacityPercentage = Math.round((simulatedVisitors / attraction.capacity) * 100);

  const handleSaveChanges = () => {
    onUpdate({
      ...attraction,
      maxDurationHours: maxDuration,
      currentVisitors: simulatedVisitors
    });
    alert('Settings updated successfully!');
  };

  return (
    <div className="animate-fade-in pb-20 px-6 min-h-screen bg-sand-50">
      <div className="mx-auto max-w-7xl pt-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
           <div>
             <button 
                onClick={onExit}
                className="flex items-center text-sm font-semibold text-brand-600 mb-2 hover:underline"
             >
                <ChevronLeft className="h-4 w-4 mr-1" /> Switch Property
             </button>
             <h2 className="font-serif text-4xl font-bold text-brand-900">{attraction.name} Dashboard</h2>
             <p className="text-brand-900/60 mt-2">Managing property at {attraction.location}</p>
           </div>
           
           <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-brand-900">System Online</span>
           </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Live Visitors */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-100">
             <div className="flex items-center gap-2 text-brand-600 mb-2 font-semibold text-sm uppercase tracking-wide">
                <Users className="h-5 w-5" />
                <span>Live Headcount</span>
             </div>
             <div className="text-4xl font-bold text-brand-900 mb-2">{simulatedVisitors.toLocaleString()}</div>
             <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${capacityPercentage > 90 ? 'bg-red-500' : 'bg-brand-500'}`} 
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                ></div>
             </div>
             <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>{capacityPercentage}% Capacity</span>
                <span>Max: {attraction.capacity}</span>
             </div>
          </div>

          {/* Card 2: Avg Duration */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-100">
             <div className="flex items-center gap-2 text-accent-600 mb-2 font-semibold text-sm uppercase tracking-wide">
                <Clock className="h-5 w-5" />
                <span>Avg Stay Time</span>
             </div>
             <div className="text-4xl font-bold text-brand-900 mb-2">{attraction.avgVisitDuration}h</div>
             <div className="text-sm text-green-600 flex items-center bg-green-50 w-fit px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                Stable
             </div>
          </div>

          {/* Card 3: Revenue (Mock) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-100">
             <div className="flex items-center gap-2 text-purple-600 mb-2 font-semibold text-sm uppercase tracking-wide">
                <TrendingUp className="h-5 w-5" />
                <span>Est. Daily Revenue</span>
             </div>
             <div className="text-4xl font-bold text-brand-900 mb-2">
                ${(simulatedVisitors * attraction.pricing.entry).toLocaleString()}
             </div>
             <div className="text-xs text-gray-400">Based on current headcount</div>
          </div>

          {/* Card 4: Alerts */}
          <div className={`${capacityPercentage > 90 ? 'bg-red-50 border-red-100' : 'bg-brand-50 border-brand-100'} p-6 rounded-3xl shadow-sm border`}>
             <div className="flex items-center gap-2 text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                <AlertCircle className="h-5 w-5" />
                <span>Status</span>
             </div>
             <div className={`text-xl font-bold mb-2 ${capacityPercentage > 90 ? 'text-red-700' : 'text-brand-900'}`}>
                {capacityPercentage > 90 ? 'High Congestion' : 'Optimal Operations'}
             </div>
             <p className="text-sm opacity-70">
                {capacityPercentage > 90 ? 'Consider limiting new entries temporarily.' : 'Traffic flow is normal.'}
             </p>
          </div>
        </div>

        {/* Management Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Control Panel 1: Duration Policy */}
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-brand-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-brand-100 p-3 rounded-full text-brand-600">
                    <Settings className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">Duration Policy</h3>
                    <p className="text-sm text-gray-500">Control how long visitors can stay</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="flex justify-between font-semibold text-gray-700 mb-2">
                       Max Allowed Duration
                       <span className="text-brand-600">{maxDuration} Hours</span>
                    </label>
                    <input 
                       type="range" 
                       min="1" 
                       max="12" 
                       step="0.5"
                       value={maxDuration}
                       onChange={(e) => setMaxDuration(parseFloat(e.target.value))}
                       className="w-full h-2 bg-brand-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                       <span>1h (Express)</span>
                       <span>12h (All Day)</span>
                    </div>
                 </div>

                 <div className="bg-orange-50 p-4 rounded-xl text-sm text-orange-800 border border-orange-100">
                    <strong>Note:</strong> Changing this setting will notify all current visitors with the new time limit immediately.
                 </div>
              </div>
           </div>

           {/* Control Panel 2: Crowd Simulation (Demo Feature) */}
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-brand-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-brand-100 p-3 rounded-full text-brand-600">
                    <Users className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">Crowd Control (Simulation)</h3>
                    <p className="text-sm text-gray-500">Manually adjust visitor count for demo</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="flex justify-between font-semibold text-gray-700 mb-2">
                       Current Visitors
                       <span className="text-brand-600">{simulatedVisitors} People</span>
                    </label>
                    <input 
                       type="range" 
                       min="0" 
                       max={attraction.capacity} 
                       step="10"
                       value={simulatedVisitors}
                       onChange={(e) => setSimulatedVisitors(parseInt(e.target.value))}
                       className="w-full h-2 bg-brand-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                 </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                 <button 
                   onClick={handleSaveChanges}
                   className="flex items-center gap-2 bg-brand-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-brand-800 transition-all hover:scale-105 active:scale-95"
                 >
                    <Save className="h-5 w-5" />
                    Save Changes
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};