import React from 'react';
import { useApp } from '../context/AppContext';
import { FilterState } from './SearchAndFilters';
import { MapPin, ArrowRight, BedDouble, Navigation } from 'lucide-react';

interface StayVerifyCityExploreProps {
  filters: FilterState;
  onSelectSuburb: (suburb: string) => void;
}

export const StayVerifyCityExplore: React.FC<StayVerifyCityExploreProps> = ({
  filters,
  onSelectSuburb
}) => {
  const { formatPrice } = useApp();

  const SUBURB_CARDS = [
    {
      name: 'Selborne Park',
      distance: '0.8 km to NUST Gate 2',
      walkTime: '8 min walk',
      bedsCount: 142,
      startingPriceUsd: 80,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      badge: '🔥 Most Popular',
      highlights: 'High Solar, Borehole Water, Near Campus'
    },
    {
      name: 'Matsheumhlope',
      distance: '1.8 km to NUST',
      walkTime: '15 min walk',
      bedsCount: 98,
      startingPriceUsd: 95,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      badge: '⚡ Quiet Study Zone',
      highlights: 'Ensuite Cottages, Fiber Wi-Fi, Security Guard'
    },
    {
      name: 'Riverside',
      distance: '2.4 km to NUST',
      walkTime: '20 min walk / 5 min combi',
      bedsCount: 80,
      startingPriceUsd: 85,
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
      badge: '💧 Borehole Guaranteed',
      highlights: 'Spacious Yards, Water Tanks, Budget Friendly'
    },
    {
      name: 'Kumalo',
      distance: '3.2 km to NUST',
      walkTime: '8 min drive / shuttle',
      bedsCount: 64,
      startingPriceUsd: 110,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      badge: '🏡 Executive Cottages',
      highlights: 'Private Studios, Aircon, Electric Gates'
    },
    {
      name: 'Bradfield',
      distance: '4.1 km to NUST',
      walkTime: 'Direct Combi Route',
      bedsCount: 45,
      startingPriceUsd: 75,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
      badge: '💰 Best Value',
      highlights: 'Near Bradfield Shopping Centre, Affordable'
    },
    {
      name: 'Bulawayo CBD',
      distance: '2.9 km to NUST',
      walkTime: '10 min direct commute',
      bedsCount: 55,
      startingPriceUsd: 90,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      badge: '🏢 City Living',
      highlights: 'Fast Supermarkets, Central Transport, Fitness Gyms'
    }
  ];

  return (
    <div className="space-y-4 mb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-rose-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Popular Student Neighborhoods</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Explore Accommodation by Suburb
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Top residential areas close to NUST campus with verified security and continuous utilities.
          </p>
        </div>

        <button
          onClick={() => onSelectSuburb('All Suburbs')}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition"
        >
          <span>View all neighborhoods</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBURB_CARDS.map((card) => {
          const isSelected = filters.suburb === card.name;

          return (
            <div
              key={card.name}
              onClick={() => onSelectSuburb(card.name)}
              className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Suburb Name & Distance Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold tracking-tight drop-shadow-sm">
                      {card.name}
                    </h3>
                    <span className="text-[11px] bg-rose-600/90 backdrop-blur-xs text-white font-bold px-2 py-0.5 rounded-full">
                      From {formatPrice(card.startingPriceUsd)}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{card.distance}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-300 font-medium">{card.walkTime}</span>
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.8 rounded-md border border-slate-700">
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-3 bg-white flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                  <span>{card.bedsCount} Verified Beds</span>
                </div>

                <span className="text-[11px] text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Explore Rooms</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
