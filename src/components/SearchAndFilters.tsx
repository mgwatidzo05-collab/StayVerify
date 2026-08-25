import React from 'react';
import { VerificationTier } from '../types';
import { useApp } from '../context/AppContext';
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
  ShieldAlert,
  LayoutGrid,
  Map,
  Columns2,
  ArrowUpDown,
  Filter
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
  sortBy?: 'recommended' | 'price_low' | 'price_high' | 'distance' | 'verified';
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
  const { formatPrice, viewMode, setViewMode } = useApp();

  const SUBURBS = ['All Suburbs', 'Selborne Park', 'Matsheumhlope', 'Riverside', 'Kumalo', 'Bradfield', 'Bulawayo CBD', 'Woodlands'];
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
    <div id="search-filter-panel" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
      {/* View Switcher & Results Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="text-sm font-extrabold text-slate-900">
            <span>{totalMatches}</span> <span className="text-slate-500 font-medium">Verified Student Beds</span>
          </div>
          {filters.suburb !== 'All Suburbs' && (
            <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full border border-rose-200">
              in {filters.suburb}
            </span>
          )}
        </div>

        {/* View Mode Switcher (Grid / Map / Split) & Sort Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy || 'recommended'}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended & Verified</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="distance">Nearest to NUST</option>
              <option value="verified">Highest Verified Only</option>
            </select>
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Map View"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Map</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                viewMode === 'split'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Split View"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Search Bar & Suburb selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="search-input"
            type="text"
            placeholder="Search by title, suburb (e.g. Selborne Park), or amenity (e.g. Solar)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition font-medium"
          />
        </div>

        <div className="md:col-span-3">
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <select
              id="suburb-select"
              value={filters.suburb}
              onChange={(e) => onFilterChange({ ...filters, suburb: e.target.value })}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold cursor-pointer"
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
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold cursor-pointer"
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Tier Pill Selector (FR-04, FR-09) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            Verification Level:
          </span>
          <button
            id="tier-filter-all"
            onClick={() => onFilterChange({ ...filters, verificationTier: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filters.verificationTier === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Listings
          </button>
          <button
            id="tier-filter-physically-verified"
            onClick={() => onFilterChange({ ...filters, verificationTier: 'physically_verified' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              filters.verificationTier === 'physically_verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Physically Verified</span>
          </button>
          <button
            id="tier-filter-document-verified"
            onClick={() => onFilterChange({ ...filters, verificationTier: 'document_verified' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              filters.verificationTier === 'document_verified'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Deed & ID Verified</span>
          </button>
        </div>

        {/* Quick Filter: Hide Suspended */}
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            id="hide-suspended-checkbox"
            type="checkbox"
            checked={filters.hideSuspended}
            onChange={(e) => onFilterChange({ ...filters, hideSuspended: e.target.checked })}
            className="rounded text-rose-600 focus:ring-rose-500"
          />
          <span className="font-medium">Hide Flagged / Under Review</span>
        </label>
      </div>

      {/* Advanced Sliders: Budget & Distance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
        {/* Price Slider */}
        <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <div className="flex justify-between text-slate-700 font-bold">
            <span>Max Budget</span>
            <span className="text-rose-600 font-black">{formatPrice(filters.maxPrice)} /mo</span>
          </div>
          <input
            id="price-range-slider"
            type="range"
            min={40}
            max={350}
            step={10}
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{formatPrice(40)}</span>
            <span>{formatPrice(180)}</span>
            <span>{formatPrice(350)}+</span>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <div className="flex justify-between text-slate-700 font-bold">
            <span>Max Distance to NUST</span>
            <span className="text-rose-600 font-black">{filters.maxDistanceKm >= 5 ? 'Any Distance' : `< ${filters.maxDistanceKm} km`}</span>
          </div>
          <input
            id="distance-range-slider"
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={filters.maxDistanceKm}
            onChange={(e) => onFilterChange({ ...filters, maxDistanceKm: Number(e.target.value) })}
            className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.5 km (Walk)</span>
            <span>2.5 km</span>
            <span>5+ km</span>
          </div>
        </div>

        {/* Essential Student Amenities Toggle Chips */}
        <div className="sm:col-span-2 space-y-1.5">
          <span className="font-bold text-slate-700 block">Critical Student Utilities:</span>
          <div className="flex flex-wrap gap-1.5">
            {KEY_AMENITIES.map(({ label, icon: Icon }) => {
              const selected = filters.amenities.some(a => label.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(label.toLowerCase()));
              return (
                <button
                  key={label}
                  id={`amenity-chip-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleAmenityToggle(label)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
                    selected
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="text-slate-600 font-medium">
          Showing <span className="font-black text-slate-900">{totalMatches}</span> verified student accommodation properties
        </div>
        <button
          id="reset-filters-btn"
          onClick={onReset}
          className="text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 transition text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
};
