import React, { useState } from 'react';
import { VerificationTier } from '../types';
import { useApp } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Sun,
  Droplets,
  Wifi,
  LayoutGrid,
  Map,
  ChevronDown,
  ChevronUp
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
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const POPULAR_SUBURBS = [
    'All Suburbs',
    'Selborne Park',
    'Riverside',
    'Matsheumhlope',
    'Kumalo',
    'Bulawayo CBD'
  ];

  const ROOM_TYPES = [
    { value: 'all', label: 'All Room Types' },
    { value: 'single', label: 'Single Room' },
    { value: 'two_sharing', label: '2-Sharing Room' },
    { value: 'four_sharing', label: '4-Sharing Room' },
    { value: 'ensuite_cottage', label: 'Ensuite Cottage' }
  ];

  const KEY_AMENITIES = [
    { label: 'Solar Power (24/7)', icon: Sun },
    { label: 'Borehole Water', icon: Droplets },
    { label: 'Fiber Wi-Fi', icon: Wifi }
  ];

  const handleAmenityToggle = (amenity: string) => {
    const nextAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: nextAmenities });
  };

  const hasActiveAdvancedFilters =
    filters.maxPrice < 300 ||
    filters.maxDistanceKm < 5 ||
    filters.verificationTier !== 'all' ||
    filters.amenities.length > 0;

  return (
    <div id="search-filter-panel" className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-6 space-y-3.5">
      
      {/* Primary Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        {/* Search keyword input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="search-input"
            type="text"
            placeholder="Search suburb, street, or landlord..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium transition"
          />
        </div>

        {/* Suburb Dropdown */}
        <div className="sm:col-span-3">
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              id="suburb-select"
              value={filters.suburb}
              onChange={(e) => onFilterChange({ ...filters, suburb: e.target.value })}
              className="w-full pl-8 pr-6 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium cursor-pointer"
            >
              {POPULAR_SUBURBS.map((suburb) => (
                <option key={suburb} value={suburb}>{suburb}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Room Type */}
        <div className="sm:col-span-3">
          <select
            id="room-type-select"
            value={filters.roomType}
            onChange={(e) => onFilterChange({ ...filters, roomType: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium cursor-pointer"
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Suburb Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-medium shrink-0">Suburbs:</span>
        {POPULAR_SUBURBS.map((suburb) => {
          const isSelected = filters.suburb === suburb;
          return (
            <button
              key={suburb}
              onClick={() => onFilterChange({ ...filters, suburb })}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {suburb}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Results Count, Filter Toggle, Sort, and View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">
            {totalMatches} {totalMatches === 1 ? 'room' : 'rooms'} found
          </span>

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
              showMoreFilters || hasActiveAdvancedFilters
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Filters</span>
            {hasActiveAdvancedFilters && (
              <span className="w-2 h-2 rounded-full bg-rose-600" />
            )}
            {showMoreFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {(filters.searchQuery || filters.suburb !== 'All Suburbs' || hasActiveAdvancedFilters) && (
            <button
              onClick={onReset}
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right side: Sort and View mode */}
        <div className="flex items-center gap-2">
          {/* Sort By */}
          <select
            value={filters.sortBy || 'recommended'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium cursor-pointer focus:outline-none"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="distance">Closest to NUST</option>
          </select>

          {/* View Toggles (Grid / Map) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {showMoreFilters && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Max Price */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex justify-between text-slate-700 font-bold">
              <span>Max Budget</span>
              <span className="text-rose-600 font-black">{formatPrice(filters.maxPrice)}/mo</span>
            </div>
            <input
              type="range"
              min={40}
              max={250}
              step={10}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$40</span>
              <span>$140</span>
              <span>$250+</span>
            </div>
          </div>

          {/* Verification Tier */}
          {/* Verified Landlord Filter */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 block">Listing Status:</span>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="verificationTier"
                  checked={filters.verificationTier === 'all'}
                  onChange={() => onFilterChange({ ...filters, verificationTier: 'all' })}
                  className="text-rose-600"
                />
                <span>All Accommodation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="verificationTier"
                  checked={filters.verificationTier === 'document_verified'}
                  onChange={() => onFilterChange({ ...filters, verificationTier: 'document_verified' })}
                  className="text-blue-600"
                />
                <span className="text-blue-800 font-medium">Verified Landlords Only</span>
              </label>
            </div>
          </div>

          {/* Essential Amenities */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 block">Must Have Utilities:</span>
            <div className="flex flex-wrap gap-1.5">
              {KEY_AMENITIES.map(({ label, icon: Icon }) => {
                const selected = filters.amenities.some(a => label.toLowerCase().includes(a.toLowerCase()));
                return (
                  <button
                    key={label}
                    onClick={() => handleAmenityToggle(label)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                      selected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
