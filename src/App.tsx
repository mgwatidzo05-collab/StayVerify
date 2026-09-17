import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
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
import { StudentLogin } from './components/StudentLogin';
import { Listing } from './types';
import {
  ShieldAlert,
  Building,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
  FileText,
  GraduationCap,
  LogOut
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    listings,
    activeTab,
    selectedListing,
    setSelectedListing,
    setIsSrsModalOpen,
    setIsReportModalOpen,
    setReportTargetListing,
    viewMode,
    studentUser,
    logoutStudent
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Find Rooms (Requires Student Login) */}
        {activeTab === 'browse' && (
          !studentUser ? (
            <StudentLogin />
          ) : (
            <div className="space-y-4">
              {/* Student Session Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-black text-slate-900">
                        Welcome, {studentUser.name}
                      </h2>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {studentUser.studentNumber || 'Verified Student'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Logged in to NUST Student Room Directory. Direct contact numbers and locations unlocked.
                    </p>
                  </div>
                </div>

                <button
                  onClick={logoutStudent}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-2 rounded-xl transition border border-slate-200 self-start sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Safety Tip Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong className="font-bold">Student Safety Advice:</strong> Always inspect the room in person before paying deposits. Never send EcoCash reservation fees without viewing.
                </span>
              </div>

              {/* Search and Filters */}
              <SearchAndFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                totalMatches={filteredListings.length}
              />

              {/* View Mode Rendering: Map vs Grid */}
              {viewMode === 'map' ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
                  <MapView
                    listings={filteredListings}
                    onOpenDetails={(l) => setSelectedListing(l)}
                  />
                </div>
              ) : (
                <>
                  {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                      {filteredListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          onOpenDetails={(l) => setSelectedListing(l)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-2xs my-6">
                      <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                        <Building className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">No rooms match your filter</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try selecting "All Suburbs", clearing your search query, or adjusting your budget limit.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Filters</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        )}

        {/* Tab 2: Smart Roommate Matching */}
        {activeTab === 'smart_match' && (
          <SmartMatching onOpenListing={(l) => setSelectedListing(l)} />
        )}

        {/* Tab 3: Messaging */}
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

        {/* Tab 6: Housing Office Analytics */}
        {activeTab === 'housing_analytics' && (
          <HousingOfficeAnalytics />
        )}
      </main>

      {/* Clean, Simple Student Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-800">StayVerify</span> — Built for NUST students in Bulawayo to find safe, verified off-campus housing.
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => {
                setReportTargetListing(null);
                setIsReportModalOpen(true);
              }}
              className="text-rose-600 hover:underline font-semibold"
            >
              Report a Scammer
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsSrsModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              SRS Requirements
            </button>
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
      <ShortlistDrawer />
      <SupportModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
