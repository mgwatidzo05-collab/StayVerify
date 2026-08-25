import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Search,
  Sparkles,
  MessageSquare,
  Building2,
  Lock,
  BarChart3,
  Users,
  AlertOctagon,
  FileText,
  UserCheck,
  LogOut,
  ChevronDown,
  Heart,
  Headphones,
  Phone,
  PlusCircle,
  Globe,
  MapPin,
  Home
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUserById,
    switchRole,
    activeTab,
    setActiveTab,
    conversations,
    reports,
    documents,
    setIsReportModalOpen,
    setReportTargetListing,
    setIsSrsModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    savedListingIds,
    setIsShortlistOpen,
    setIsSupportModalOpen,
    selectedCurrency,
    setSelectedCurrency
  } = useApp();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const openReportsCount = reports.filter(r => r.status === 'open' || r.status === 'under_investigation').length;
  const pendingDocsCount = documents.filter(d => d.status === 'pending').length;

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white text-slate-900 border-b border-slate-200 shadow-xs">
      {/* Top Notification & Trust Strip */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
            <span>⭐ Trust Score 4.8 / 5</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-normal">Over 1,000+ NUST Beds Verified</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-rose-300 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">Zero-Scam Guarantee &bull; 100% Free Booking Assistance</span>
          </div>
        </div>

        {/* Top Right: Currency, Role, and SRS */}
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] px-2 py-0.5 rounded border border-slate-700 font-mono transition"
            >
              <Globe className="w-3 h-3 text-slate-400" />
              <span>{selectedCurrency}</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-1 z-50 text-[11px]">
                {(['USD', 'GBP', 'EUR', 'ZWL'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setSelectedCurrency(curr);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded transition ${
                      selectedCurrency === curr ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account Stakeholder Switcher */}
          <div className="flex items-center bg-slate-900 rounded-md p-0.5 border border-slate-700/80">
            <button
              id="role-btn-student"
              onClick={() => switchRole('student')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'student'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🎓 Student
            </button>
            <button
              id="role-btn-landlord"
              onClick={() => switchRole('landlord')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'landlord'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🏠 Host
            </button>
            <button
              id="role-btn-admin"
              onClick={() => switchRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🛡️ Admin {openReportsCount > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1 rounded-full">{openReportsCount}</span>}
            </button>
            <button
              id="role-btn-housing"
              onClick={() => switchRole('housing_office')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'housing_office'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🏛️ Liaison
            </button>
          </div>

          {/* SRS Spec Traceability */}
          <button
            id="open-srs-spec-btn"
            onClick={() => setIsSrsModalOpen(true)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-700 transition"
            title="View Software Requirements Traceability Matrix"
          >
            <FileText className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline font-mono">SRS Spec</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand: StayVerify */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('browse')}>
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-md shadow-rose-600/30 text-white font-black text-xl">
            <Home className="w-5 h-5 fill-white stroke-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                StayVerify<span className="text-rose-600">.</span>
              </span>
              <span className="bg-rose-50 text-rose-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-rose-200">
                NUST Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
              Verified Student Housing &bull; Bulawayo
            </p>
          </div>
        </div>

        {/* Global Quick Search Pill */}
        <div
          onClick={() => setActiveTab('browse')}
          className="hidden md:flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 px-3.5 py-2 rounded-full cursor-pointer transition text-xs text-slate-500 max-w-xs w-full"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">Search Selborne Park, Riverside, NUST...</span>
          <span className="ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
            Ctrl+K
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 24x7 Assistance Button */}
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition border border-slate-200"
          >
            <Headphones className="w-3.5 h-3.5 text-rose-600" />
            <span>24x7 Support</span>
          </button>

          {/* Shortlist Heart Button */}
          <button
            id="shortlist-btn"
            onClick={() => setIsShortlistOpen(true)}
            className="relative p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200"
            title="View Saved Shortlist"
          >
            <Heart className={`w-4 h-4 ${savedListingIds.length > 0 ? 'fill-rose-600 text-rose-600' : ''}`} />
            {savedListingIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {savedListingIds.length}
              </span>
            )}
          </button>

          {/* Post Accommodation Button for Landlords */}
          <button
            onClick={() => {
              switchRole('landlord');
              setActiveTab('landlord_portal');
            }}
            className="hidden lg:flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Post Room (Free)</span>
          </button>

          {/* User Account / Profile Menu */}
          <div className="relative group">
            <button
              id="user-profile-menu-btn"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <span className="hidden sm:inline truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 text-slate-800">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="font-bold text-slate-900 text-xs">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                {currentUser.studentNumber && (
                  <p className="text-[11px] font-mono text-rose-600 font-medium mt-0.5">ID: {currentUser.studentNumber}</p>
                )}
                {currentUser.institution && (
                  <p className="text-[11px] text-slate-400">{currentUser.institution}</p>
                )}
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">Switch Account:</div>
              {allUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => switchUserById(user.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                    user.id === currentUser.id ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{user.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                </button>
              ))}

              <div className="border-t border-slate-100 mt-2 pt-2 flex gap-1.5">
                <button
                  onClick={() => {
                    setAuthModalMode('register_student');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-1/2 text-center text-xs font-bold py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-1/2 text-center text-xs font-bold py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs font-semibold">
            <button
              id="tab-browse"
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore All Rooms</span>
            </button>

            <button
              id="tab-smart-match"
              onClick={() => setActiveTab('smart_match')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'smart_match'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Smart Roommate Match</span>
            </button>

            <button
              id="tab-messages"
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>Messages & Inquiries</span>
            </button>

            <button
              id="tab-landlord"
              onClick={() => setActiveTab('landlord_portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'landlord_portal'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Host Portal</span>
            </button>

            <button
              id="tab-admin"
              onClick={() => setActiveTab('admin_portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'admin_portal'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Queue</span>
              {(openReportsCount > 0 || pendingDocsCount > 0) && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {openReportsCount + pendingDocsCount}
                </span>
              )}
            </button>

            <button
              id="tab-housing"
              onClick={() => setActiveTab('housing_analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'housing_analytics'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Housing Analytics</span>
            </button>
          </nav>

          {/* Quick Fraud Report Pill */}
          <button
            onClick={() => {
              setReportTargetListing(null);
              setIsReportModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 text-rose-600 hover:text-rose-700 text-xs font-bold px-2 py-1 rounded transition hover:bg-rose-50 shrink-0"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Report Red Flag</span>
          </button>
        </div>
      </div>
    </header>
  );
};
