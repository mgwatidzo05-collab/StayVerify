import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from './VerificationBadge';
import {
  MapPin,
  Navigation,
  School,
  Sun,
  Droplets,
  Wifi,
  Eye,
  Star,
  ExternalLink,
  ShieldCheck,
  X,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface MapViewProps {
  listings: Listing[];
  onOpenDetails: (listing: Listing) => void;
}

export const MapView: React.FC<MapViewProps> = ({ listings, onOpenDetails }) => {
  const { formatPrice, toggleSaveListing, isListingSaved } = useApp();
  const [selectedMapListing, setSelectedMapListing] = useState<Listing | null>(listings[0] || null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterRadius, setFilterRadius] = useState<number>(5);

  // Approximate relative coordinate positions on our Bulawayo NUST map canvas
  const getCoordinatesForListing = (listing: Listing) => {
    // Generate pseudo deterministic map offsets based on suburb & ID
    const coordsMap: Record<string, { top: number; left: number }> = {
      'Selborne Park': { top: 48, left: 56 },
      'Matsheumhlope': { top: 32, left: 42 },
      'Riverside': { top: 62, left: 68 },
      'Kumalo': { top: 22, left: 34 },
      'Bradfield': { top: 70, left: 28 },
      'Bulawayo CBD': { top: 20, left: 20 },
      'Woodlands': { top: 78, left: 74 }
    };

    const base = coordsMap[listing.suburb] || { top: 50, left: 50 };
    // Add micro jitter based on listing id
    const hash = listing.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetTop = ((hash % 7) - 3) * 1.8;
    const offsetLeft = (((hash * 3) % 7) - 3) * 1.8;

    return {
      top: Math.max(15, Math.min(85, base.top + offsetTop)),
      left: Math.max(15, Math.min(85, base.left + offsetLeft))
    };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Map Control Bar */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Interactive Campus Proximity Map</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                Live GPS Distances
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Center: National University of Science & Technology (NUST Gate 1 & 2)
            </div>
          </div>
        </div>

        {/* Map Filters & Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Max Distance:</span>
          <select
            value={filterRadius}
            onChange={(e) => setFilterRadius(Number(e.target.value))}
            className="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
          >
            <option value={1}>Within 1.0 km (Selborne Park)</option>
            <option value={2}>Within 2.0 km (Matsheumhlope)</option>
            <option value={3}>Within 3.0 km (Riverside & Ascot)</option>
            <option value={5}>Within 5.0 km (All Bulawayo)</option>
          </select>

          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
              className="p-1 text-slate-300 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.85, prev - 0.15))}
              className="p-1 text-slate-300 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="relative aspect-16/10 sm:aspect-21/9 min-h-[420px] w-full bg-slate-950 overflow-hidden select-none">
        {/* Styled Simulated GIS Map Grid Background */}
        <div
          className="absolute inset-0 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Street & Suburb Grid Vector Simulation */}
          <div className="absolute inset-0 bg-[#0f172a] opacity-95">
            {/* Roads & Commute Arteries */}
            <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />

              {/* Main Gwanda Road (Passing NUST) */}
              <line x1="0%" y1="65%" x2="100%" y2="35%" stroke="#f43f5e" strokeWidth="4" strokeDasharray="6 3" />
              {/* Cecil Avenue / Ascot link */}
              <line x1="20%" y1="0%" x2="60%" y2="100%" stroke="#475569" strokeWidth="3" />
              {/* Selborne Park Ring */}
              <circle cx="56%" cy="50%" r="90" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Riverside Link */}
              <line x1="56%" y1="50%" x2="70%" y2="65%" stroke="#38bdf8" strokeWidth="2" />
            </svg>
          </div>

          {/* Suburb Name Labels */}
          <div className="absolute top-[42%] left-[53%] text-[11px] font-bold text-emerald-400/80 uppercase tracking-widest pointer-events-none">
            Selborne Park
          </div>
          <div className="absolute top-[28%] left-[38%] text-[11px] font-bold text-blue-400/80 uppercase tracking-widest pointer-events-none">
            Matsheumhlope
          </div>
          <div className="absolute top-[58%] left-[65%] text-[11px] font-bold text-cyan-400/80 uppercase tracking-widest pointer-events-none">
            Riverside
          </div>
          <div className="absolute top-[18%] left-[32%] text-[11px] font-bold text-slate-400/80 uppercase tracking-widest pointer-events-none">
            Kumalo
          </div>
          <div className="absolute top-[68%] left-[24%] text-[11px] font-bold text-amber-400/80 uppercase tracking-widest pointer-events-none">
            Bradfield
          </div>

          {/* University Campus Epicenter Marker */}
          <div
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="w-12 h-12 rounded-full bg-rose-600/30 border-2 border-rose-500 animate-ping absolute" />
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-xl z-10 border-2 border-white">
              <School className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-500 shadow-md mt-1 whitespace-nowrap">
              🏛️ NUST Main Campus
            </div>
          </div>

          {/* Accommodation Price Pins */}
          {listings.map((listing) => {
            const coords = getCoordinatesForListing(listing);
            const isSelected = selectedMapListing?.id === listing.id;
            const isPhysicallyVerified = listing.verificationBadge === 'physically_verified';

            return (
              <div
                key={listing.id}
                style={{ top: `${coords.top}%`, left: `${coords.left}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedMapListing(listing)}
              >
                <div
                  className={`group px-2 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg transition-transform ${
                    isSelected
                      ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 scale-110 z-40'
                      : isPhysicallyVerified
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:scale-105'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{formatPrice(listing.pricePerMonthUsd)}</span>
                  {isPhysicallyVerified && <span className="text-[10px]">🛡️</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Listing Popup Card */}
        {selectedMapListing && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <VerificationBadge tier={selectedMapListing.verificationBadge} size="sm" showDetails />
                <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                  {selectedMapListing.distanceToCampusKm} km from NUST
                </span>
              </div>
              <button
                onClick={() => setSelectedMapListing(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3">
              <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={selectedMapListing.media[0]?.url}
                  alt={selectedMapListing.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {selectedMapListing.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                    <span className="truncate">{selectedMapListing.suburb}, Bulawayo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-sm font-black text-rose-600">
                      {formatPrice(selectedMapListing.pricePerMonthUsd)}
                    </span>
                    <span className="text-[10px] text-slate-500"> /mo</span>
                  </div>

                  <button
                    onClick={() => onOpenDetails(selectedMapListing)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
