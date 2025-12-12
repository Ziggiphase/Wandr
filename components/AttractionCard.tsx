import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Attraction } from '../types';

interface Props {
  attraction: Attraction;
  onClick: (id: string) => void;
}

export const AttractionCard: React.FC<Props> = ({ attraction, onClick }) => {
  return (
    <div 
      onClick={() => onClick(attraction.id)}
      className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:shadow-2xl"
    >
      <img 
        src={attraction.imageUrl} 
        alt={attraction.name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      
      <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
        <div className="mb-2 flex items-center space-x-2 text-sm font-medium text-brand-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
            {attraction.category}
          </span>
          <div className="flex items-center">
            <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            {attraction.rating}
          </div>
        </div>
        
        <h3 className="mb-1 font-serif text-2xl font-bold leading-tight">{attraction.name}</h3>
        
        <div className="flex items-center text-gray-300">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="text-sm">{attraction.location}</span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm text-gray-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {attraction.description}
        </p>
      </div>
    </div>
  );
};