import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
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
  AlertTriangle,
  Sparkles,
  Info,
  Building,
  School,
  Lock,
  HeartHandshake,
  CheckCircle2,
  FileText
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    listings,
    activeTab,
    selectedListing,
    setSelectedListing,
    setIsSrsModalOpen
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
    hideSuspended: false
  });

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
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
      hideSuspended: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Browse Verified Listings */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Anti-Scam Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Zero-Tolerance Scam Policy
                  </span>
                  <span className="text-slate-400 text-xs font-mono">&bull; National University of Science & Technology</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Verified Off-Campus Student Housing
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Every listed property undergoes document title verification or physical campus safety inspection. Never send money before an in-person physical walk-through.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsSrsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>SRS Compliance Spec</span>
                </button>
              </div>
            </div>

            {/* Filter Component */}
            <SearchAndFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              totalMatches={filteredListings.length}
            />

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onOpenDetails={(l) => setSelectedListing(l)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Building className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No matching verified properties found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your budget slider, distance range, or selecting "All Tiers" to see available student rooms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Smart Allocation & Matching */}
        {activeTab === 'smart_match' && (
          <SmartMatching onOpenListing={(l) => setSelectedListing(l)} />
        )}

        {/* Tab 3: Roommates Matching Board */}
        {activeTab === 'roommates' && (
          <SmartMatching onOpenListing={(l) => setSelectedListing(l)} />
        )}

        {/* Tab 4: Secure Messaging */}
        {activeTab === 'messages' && (
          <MessagingCenter />
        )}

        {/* Tab 5: Landlord Hub */}
        {activeTab === 'landlord_portal' && (
          <LandlordDashboard />
        )}

        {/* Tab 6: Admin Operations */}
        {activeTab === 'admin_portal' && (
          <AdminDashboard />
        )}

        {/* Tab 7: University Housing Office Analytics */}
        {activeTab === 'housing_analytics' && (
          <HousingOfficeAnalytics />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-12 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>StayVerify Student Accommodation Anti-Scam Platform</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              National University of Science and Technology (NUST) &bull; Department of Computer Science &bull; Document Version 1.0 (August 2026)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setIsSrsModalOpen(true)} className="hover:text-white transition">
              SRS Traceability Matrix
            </button>
            <span>&bull;</span>
            <span className="text-slate-500">Zimbabwean Data Protection Compliant (NFR-08)</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">Zero-Fee Student Protection</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

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
