import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FilterState } from './SearchAndFilters';
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  ShieldCheck,
  Zap,
  Headphones,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';

interface StayVerifyHeroProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onSearchSubmit: () => void;
}

export const StayVerifyHero: React.FC<StayVerifyHeroProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit
}) => {
  const { listings, setIsSupportModalOpen, formatPrice } = useApp();
  const [activeSearchTab, setActiveSearchTab] = useState<'all' | 'single' | 'ensuite' | 'sharing'>('all');

  const POPULAR_AREAS = [
    { name: 'Selborne Park', distance: '0.8 km', count: 142, icon: '🔥' },
    { name: 'Matsheumhlope', distance: '1.8 km', count: 98, icon: '⚡' },
    { name: 'Riverside', distance: '2.4 km', count: 80, icon: '💧' },
    { name: 'Kumalo', distance: '3.2 km', count: 64, icon: '🏡' },
    { name: 'Bulawayo CBD', distance: '2.9 km', count: 55, icon: '🏢' }
  ];

  const handleSuburbClick = (suburbName: string) => {
    onFilterChange({
      ...filters,
      suburb: suburbName,
      searchQuery: ''
    });
    onSearchSubmit();
  };

  const handleTabSelect = (tab: 'all' | 'single' | 'ensuite' | 'sharing') => {
    setActiveSearchTab(tab);
    let roomType = 'all';
    if (tab === 'single') roomType = 'single';
    if (tab === 'ensuite') roomType = 'ensuite_cottage';
    if (tab === 'sharing') roomType = 'two_sharing';
    onFilterChange({ ...filters, roomType });
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mb-10">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto space-y-7">
        {/* Top Tag & Trust Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>NUST Accredited Student Housing &bull; 2025/2026 Academic Year</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full text-xs text-slate-300 backdrop-blur-sm">
            <div className="flex text-emerald-400">
              {'★'.repeat(5)}
            </div>
            <span className="font-bold text-white">4.8 / 5</span>
            <span className="text-slate-400 hidden sm:inline">&bull; 2,400+ NUST Students</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-3 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Book Student Accommodation Near{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-300">
              NUST Bulawayo
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
            Find & book 100% verified student rooms, ensuite cottages, and private apartments with zero deposit fraud risk and verified physical safety audits.
          </p>
        </div>

        {/* StayVerify Floating Search Widget */}
        <div className="bg-white text-slate-900 rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-200/80">
          {/* Quick Room Category Tabs */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => handleTabSelect('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeSearchTab === 'all'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🏢 All Properties ({listings.length})
            </button>
            <button
              onClick={() => handleTabSelect('single')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeSearchTab === 'single'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🛏️ Single Rooms
            </button>
            <button
              onClick={() => handleTabSelect('ensuite')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeSearchTab === 'ensuite'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🚿 Ensuite Cottages
            </button>
            <button
              onClick={() => handleTabSelect('sharing')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeSearchTab === 'sharing'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              👥 2/4-Sharing Rooms
            </button>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3">
            {/* Input 1: Search Location / Keyword */}
            <div className="md:col-span-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl p-2.5 border border-slate-200 transition flex flex-col justify-center">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Location / Suburb</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Selborne Park, Riverside..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Input 2: Suburb Dropdown */}
            <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl p-2.5 border border-slate-200 transition flex flex-col justify-center">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Home className="w-3.5 h-3.5 text-rose-600" />
                <span>Suburb Area</span>
              </label>
              <select
                value={filters.suburb}
                onChange={(e) => onFilterChange({ ...filters, suburb: e.target.value })}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All Suburbs">All Suburbs (Bulawayo)</option>
                <option value="Selborne Park">Selborne Park (0.8km)</option>
                <option value="Matsheumhlope">Matsheumhlope (1.8km)</option>
                <option value="Riverside">Riverside (2.4km)</option>
                <option value="Kumalo">Kumalo (3.2km)</option>
                <option value="Bradfield">Bradfield (4.1km)</option>
                <option value="Bulawayo CBD">Bulawayo CBD (2.9km)</option>
                <option value="Woodlands">Woodlands (3.5km)</option>
              </select>
            </div>

            {/* Input 3: Max Budget */}
            <div className="md:col-span-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl p-2.5 border border-slate-200 transition flex flex-col justify-center">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-rose-600" />
                <span>Max Budget</span>
              </label>
              <select
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={80}>Up to {formatPrice(80)}/mo</option>
                <option value={100}>Up to {formatPrice(100)}/mo</option>
                <option value={150}>Up to {formatPrice(150)}/mo</option>
                <option value={200}>Up to {formatPrice(200)}/mo</option>
                <option value={300}>Up to {formatPrice(300)}/mo</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-3 flex items-stretch">
              <button
                id="hero-search-btn"
                onClick={onSearchSubmit}
                className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search Verified Beds</span>
              </button>
            </div>
          </div>

          {/* Quick Suburb Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1 mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
              Popular Areas:
            </span>
            {POPULAR_AREAS.map((area) => (
              <button
                key={area.name}
                type="button"
                onClick={() => handleSuburbClick(area.name)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                  filters.suburb === area.name
                    ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                }`}
              >
                <span>{area.icon}</span>
                <span>{area.name}</span>
                <span className="text-[10px] text-slate-400">({area.distance})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4 Core Value Propositions Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Verified</div>
              <div className="text-[11px] text-slate-400 leading-tight">Physical inspection by NUST liaison</div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Price Match</div>
              <div className="text-[11px] text-slate-400 leading-tight">Zero middleman extortion fees</div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Instant Inquiry</div>
              <div className="text-[11px] text-slate-400 leading-tight">Direct chat with vetted landlords</div>
            </div>
          </div>

          <div 
            onClick={() => setIsSupportModalOpen(true)}
            className="bg-slate-800/60 border border-slate-700/60 hover:border-slate-500 rounded-xl p-3 flex items-start gap-2.5 backdrop-blur-sm cursor-pointer transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>24x7 Assistance</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">Free 1-on-1 booking help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
