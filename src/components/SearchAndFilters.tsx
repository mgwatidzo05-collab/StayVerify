import React from 'react';
import { VerificationTier } from '../types';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Sun,
  Droplets,
  Wifi,
  ShieldAlert
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  suburb: string;
  minPrice: number;
  maxPrice: number;
  maxDistanceKm: number;
  verificationTier: 'all' | VerificationTier;
  roomType: string;
  amenities: string[];
  genderPreference: string;
  hideSuspended: boolean;
}

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalMatches: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalMatches
}) => {
  const SUBURBS = ['All Suburbs', 'Riverside', 'Selborne Park', 'Woodlands', 'Matsheumhlope', 'Bradfield', 'Bulawayo CBD'];
  const ROOM_TYPES = [
    { value: 'all', label: 'All Room Types' },
    { value: 'single', label: 'Single Room' },
    { value: 'two_sharing', label: '2-Sharing Room' },
    { value: 'four_sharing', label: '4-Sharing Room' },
    { value: 'ensuite_cottage', label: 'Ensuite Cottage' },
    { value: 'studio', label: 'Studio Apartment' }
  ];

  const KEY_AMENITIES = [
    { label: 'Solar Power (24/7)', icon: Sun },
    { label: 'Borehole Water', icon: Droplets },
    { label: 'Fiber Wi-Fi', icon: Wifi },
    { label: 'Electric Fence & Guard', icon: ShieldCheck }
  ];

  const handleAmenityToggle = (amenity: string) => {
    const nextAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: nextAmenities });
  };

  return (
    <div id="search-filter-panel" className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6 space-y-4">
      {/* Primary Search Bar & Suburb selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="search-input"
            type="text"
            placeholder="Search verified accommodation by title, suburb, or amenity..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="md:col-span-3">
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              id="suburb-select"
              value={filters.suburb}
              onChange={(e) => onFilterChange({ ...filters, suburb: e.target.value })}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium"
            >
              {SUBURBS.map((suburb) => (
                <option key={suburb} value={suburb}>{suburb}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-3">
          <select
            id="room-type-select"
            value={filters.roomType}
            onChange={(e) => onFilterChange({ ...filters, roomType: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Tier Pill Selector (FR-04, FR-09) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Verification Tier:
          </span>
          <button
            id="tier-filter-all"
            onClick={() => onFilterChange({ ...filters, verificationTier: 'all' })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filters.verificationTier === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Tiers
          </button>
          <button
            id="tier-filter-physically-verified"
            onClick={() => onFilterChange({ ...filters, verificationTier: 'physically_verified' })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
              filters.verificationTier === 'physically_verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Physically Verified (Highest Trust)
          </button>
          <button
            id="tier-filter-document-verified"
            onClick={() => onFilterChange({ ...filters, verificationTier: 'document_verified' })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
              filters.verificationTier === 'document_verified'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Document Verified
          </button>
        </div>

        {/* Quick Filter: Hide Suspended */}
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            id="hide-suspended-checkbox"
            type="checkbox"
            checked={filters.hideSuspended}
            onChange={(e) => onFilterChange({ ...filters, hideSuspended: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Hide Suspended / Under-Review listings</span>
        </label>
      </div>

      {/* Advanced Sliders: Budget & Distance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
        {/* Price Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-700 font-semibold">
            <span>Max Budget (USD)</span>
            <span className="text-blue-600">${filters.maxPrice} / month</span>
          </div>
          <input
            id="price-range-slider"
            type="range"
            min={40}
            max={350}
            step={10}
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>$40</span>
            <span>$200</span>
            <span>$350+</span>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-700 font-semibold">
            <span>Max Distance to NUST</span>
            <span className="text-blue-600">{filters.maxDistanceKm >= 5 ? 'Any Distance' : `< ${filters.maxDistanceKm} km`}</span>
          </div>
          <input
            id="distance-range-slider"
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={filters.maxDistanceKm}
            onChange={(e) => onFilterChange({ ...filters, maxDistanceKm: Number(e.target.value) })}
            className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.5 km (Walk)</span>
            <span>2.5 km</span>
            <span>5+ km</span>
          </div>
        </div>

        {/* Essential Student Amenities Toggle Chips */}
        <div className="sm:col-span-2 space-y-1.5">
          <span className="font-semibold text-slate-700 block">Critical Student Infrastructure:</span>
          <div className="flex flex-wrap gap-1.5">
            {KEY_AMENITIES.map(({ label, icon: Icon }) => {
              const selected = filters.amenities.some(a => label.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(label.toLowerCase()));
              return (
                <button
                  key={label}
                  id={`amenity-chip-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleAmenityToggle(label)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border flex items-center gap-1 transition ${
                    selected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="text-slate-600">
          Showing <span className="font-bold text-slate-900">{totalMatches}</span> verified student accommodation properties
        </div>
        <button
          id="reset-filters-btn"
          onClick={onReset}
          className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1 transition text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
