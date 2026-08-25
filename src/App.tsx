import React, { useState, useMemo, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StayVerifyHero } from './components/StayVerifyHero';
import { StayVerifyCityExplore } from './components/StayVerifyCityExplore';
import { StayVerifyHowItWorks } from './components/StayVerifyHowItWorks';
import { StayVerifyPerksBanner } from './components/StayVerifyPerksBanner';
import { StayVerifyTestimonials } from './components/StayVerifyTestimonials';
import { MapView } from './components/MapView';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { SupportModal } from './components/SupportModal';
import { SearchAndFilters, FilterState } from './components/SearchAndFilters';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { ReportScamModal } from './components/ReportScamModal';
import { SRSTraceabilityModal } from './components/SRSTraceabilityModal';
import { AuthModal } from './components/AuthModal';
import { SmartMatching } from './components/SmartMatching';
import { MessagingCenter } from './components/MessagingCenter';
import { LandlordDashboard } from './components/LandlordDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { HousingOfficeAnalytics } from './components/HousingOfficeAnalytics';
import { Listing } from './types';
import {
  ShieldCheck,
  Building,
  School,
  Lock,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Headphones,
  MapPin,
  Heart,
  Globe,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    listings,
    activeTab,
    selectedListing,
    setSelectedListing,
    setIsSrsModalOpen,
    viewMode,
    setIsSupportModalOpen
  } = useApp();

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    suburb: 'All Suburbs',
    minPrice: 40,
    maxPrice: 300,
    maxDistanceKm: 5,
    verificationTier: 'all',
    roomType: 'all',
    amenities: [],
    genderPreference: 'all',
    hideSuspended: false,
    sortBy: 'recommended'
  });

  const listingsSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToListings = () => {
    listingsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredListings = useMemo(() => {
    let result = listings.filter((listing) => {
      // Hide suspended toggle
      if (filters.hideSuspended && (listing.status === 'suspended_under_review' || listing.status === 'banned')) {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = listing.title.toLowerCase().includes(q);
        const matchesSuburb = listing.suburb.toLowerCase().includes(q);
        const matchesAddress = listing.address.toLowerCase().includes(q);
        const matchesAmenities = listing.amenities.some(a => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSuburb && !matchesAddress && !matchesAmenities) {
          return false;
        }
      }

      // Suburb
      if (filters.suburb !== 'All Suburbs' && listing.suburb !== filters.suburb) {
        return false;
      }

      // Room Type
      if (filters.roomType !== 'all' && listing.roomType !== filters.roomType) {
        return false;
      }

      // Verification Tier
      if (filters.verificationTier !== 'all' && listing.verificationBadge !== filters.verificationTier) {
        return false;
      }

      // Price Range
      if (listing.pricePerMonthUsd > filters.maxPrice) {
        return false;
      }

      // Distance
      if (filters.maxDistanceKm < 5 && listing.distanceToCampusKm > filters.maxDistanceKm) {
        return false;
      }

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(req =>
          listing.amenities.some(a => a.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // Sorting
    if (filters.sortBy === 'price_low') {
      result.sort((a, b) => a.pricePerMonthUsd - b.pricePerMonthUsd);
    } else if (filters.sortBy === 'price_high') {
      result.sort((a, b) => b.pricePerMonthUsd - a.pricePerMonthUsd);
    } else if (filters.sortBy === 'distance') {
      result.sort((a, b) => a.distanceToCampusKm - b.distanceToCampusKm);
    } else if (filters.sortBy === 'verified') {
      result.sort((a, b) => {
        if (a.verificationBadge === 'physically_verified' && b.verificationBadge !== 'physically_verified') return -1;
        if (b.verificationBadge === 'physically_verified' && a.verificationBadge !== 'physically_verified') return 1;
        return 0;
      });
    }

    return result;
  }, [listings, filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      suburb: 'All Suburbs',
      minPrice: 40,
      maxPrice: 300,
      maxDistanceKm: 5,
      verificationTier: 'all',
      roomType: 'all',
      amenities: [],
      genderPreference: 'all',
      hideSuspended: false,
      sortBy: 'recommended'
    });
  };

  const handleSelectSuburbFromExplore = (suburb: string) => {
    setFilters(prev => ({
      ...prev,
      suburb: suburb,
      searchQuery: ''
    }));
    handleScrollToListings();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-rose-600 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Browse Verified Listings */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            {/* StayVerify Hero Section with Multi-Tab Search */}
            <StayVerifyHero
              filters={filters}
              onFilterChange={setFilters}
              onSearchSubmit={handleScrollToListings}
            />

            {/* StayVerify Popular Suburbs Explorer */}
            <StayVerifyCityExplore
              filters={filters}
              onSelectSuburb={handleSelectSuburbFromExplore}
            />

            {/* Main Listings and Search Controls */}
            <div ref={listingsSectionRef} className="pt-2">
              <SearchAndFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                totalMatches={filteredListings.length}
              />

              {/* View Modes Rendering */}
              {viewMode === 'map' && (
                <MapView
                  listings={filteredListings}
                  onOpenDetails={(l) => setSelectedListing(l)}
                />
              )}

              {viewMode === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                  <div className="lg:col-span-6 space-y-4 max-h-[820px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          onOpenDetails={(l) => setSelectedListing(l)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-6 sticky top-24 h-[820px]">
                    <MapView
                      listings={filteredListings}
                      onOpenDetails={(l) => setSelectedListing(l)}
                    />
                  </div>
                </div>
              )}

              {viewMode === 'grid' && (
                <>
                  {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {filteredListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          onOpenDetails={(l) => setSelectedListing(l)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs mb-12">
                      <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                        <Building className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No matching student accommodation found</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Try clearing your search keyword, adjusting your budget limit, or selecting "All Tiers" to see other options near campus.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* StayVerify+ Student Perks Strip */}
            <StayVerifyPerksBanner />

            {/* StayVerify How It Works 3-Step Flow */}
            <StayVerifyHowItWorks />

            {/* StayVerify Testimonials & Score */}
            <StayVerifyTestimonials />
          </div>
        )}

        {/* Tab 2: Smart Allocation & Matching */}
        {activeTab === 'smart_match' && (
          <SmartMatching onOpenListing={(l) => setSelectedListing(l)} />
        )}

        {/* Tab 3: Secure Messaging */}
        {activeTab === 'messages' && (
          <MessagingCenter />
        )}

        {/* Tab 4: Landlord Hub */}
        {activeTab === 'landlord_portal' && (
          <LandlordDashboard />
        )}

        {/* Tab 5: Admin Operations */}
        {activeTab === 'admin_portal' && (
          <AdminDashboard />
        )}

        {/* Tab 6: University Housing Office Analytics */}
        {activeTab === 'housing_analytics' && (
          <HousingOfficeAnalytics />
        )}
      </main>

      {/* StayVerify Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold">
                  🏠
                </div>
                <span className="text-xl font-black text-white">StayVerify<span className="text-rose-500">.</span></span>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Official
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                NUST's official verified student housing network. Ensuring 100% scam-free off-campus accommodation across Bulawayo.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <span>⭐ 4.8 / 5 Verified Student Rating</span>
              </div>
            </div>

            {/* Column 2: Popular Suburbs */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Top Neighborhoods</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => handleSelectSuburbFromExplore('Selborne Park')} className="hover:text-white transition">Selborne Park (0.8km)</button></li>
                <li><button onClick={() => handleSelectSuburbFromExplore('Matsheumhlope')} className="hover:text-white transition">Matsheumhlope (1.8km)</button></li>
                <li><button onClick={() => handleSelectSuburbFromExplore('Riverside')} className="hover:text-white transition">Riverside (2.4km)</button></li>
                <li><button onClick={() => handleSelectSuburbFromExplore('Kumalo')} className="hover:text-white transition">Kumalo (3.2km)</button></li>
                <li><button onClick={() => handleSelectSuburbFromExplore('Bradfield')} className="hover:text-white transition">Bradfield (4.1km)</button></li>
              </ul>
            </div>

            {/* Column 3: Safety & Policies */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Anti-Scam Standards</h4>
              <ul className="space-y-1.5 text-xs">
                <li><span className="text-emerald-400">✓ No Viewing Fees Policy</span></li>
                <li><span className="text-emerald-400">✓ EXIF Geotag Verification</span></li>
                <li><span className="text-emerald-400">✓ Title Deed Confirmation</span></li>
                <li><button onClick={() => setIsSrsModalOpen(true)} className="hover:text-white transition underline">SRS FR-01 to FR-23 Spec</button></li>
              </ul>
            </div>

            {/* Column 4: 24/7 Contact Desk */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">24x7 Student Help</h4>
              <p className="text-xs text-slate-400">Free 1-on-1 housing advisor support on WhatsApp.</p>
              <div className="pt-1">
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 text-xs"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Contact Housing Advisor</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; 2026 StayVerify Student Housing Network. In compliance with NUST Housing Policies & Zimbabwe Data Protection Act.
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setIsSrsModalOpen(true)} className="hover:text-slate-300 transition">
                SRS Traceability
              </button>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold">100% Student Free</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

      <ShortlistDrawer
        onOpenDetails={(l) => setSelectedListing(l)}
      />
      <SupportModal />
      <ReportScamModal />
      <SRSTraceabilityModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
