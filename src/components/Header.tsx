import React from 'react';
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
  ChevronDown
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
    setAuthModalMode
  } = useApp();

  const openReportsCount = reports.filter(r => r.status === 'open' || r.status === 'under_investigation').length;
  const pendingDocsCount = documents.filter(d => d.status === 'pending').length;

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
      {/* Top University Safety & Role Switcher Bar */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            NUST Anti-Scam Shield Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">Bulawayo Student Accommodation Verification Network</span>
        </div>

        {/* Stakeholder Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-medium hidden md:inline">Account Role:</span>
          <div className="flex items-center bg-slate-900 rounded-md p-0.5 border border-slate-700/80">
            <button
              id="role-btn-student"
              onClick={() => switchRole('student')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🎓 Student
            </button>
            <button
              id="role-btn-landlord"
              onClick={() => switchRole('landlord')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'landlord'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🏠 Landlord
            </button>
            <button
              id="role-btn-admin"
              onClick={() => switchRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🛡️ Admin {openReportsCount > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1 rounded-full">{openReportsCount}</span>}
            </button>
            <button
              id="role-btn-housing"
              onClick={() => switchRole('housing_office')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser.role === 'housing_office'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🏛️ Housing Office
            </button>
          </div>

          {/* SRS Document Traceability Button */}
          <button
            id="open-srs-spec-btn"
            onClick={() => setIsSrsModalOpen(true)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs border border-slate-700 transition"
            title="View NUST Software Requirements Specification Traceability Matrix (FR-01 to FR-23)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline font-mono text-[11px]">SRS Traceability</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('browse')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/10">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">StayVerify</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border border-emerald-500/30">
                SRS v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Verified Student Housing & Anti-Scam Platform</p>
          </div>
        </div>

        {/* Primary Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            id="tab-browse"
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Verified Listings
          </button>

          <button
            id="tab-smart-match"
            onClick={() => setActiveTab('smart_match')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'smart_match'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Smart Match & Allocation
          </button>

          <button
            id="tab-roommates"
            onClick={() => setActiveTab('roommates')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'roommates'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-teal-400" />
            Roommates
          </button>

          <button
            id="tab-messages"
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            Secure Messaging
          </button>

          {/* Landlord Specific or Quick Switch */}
          <button
            id="tab-landlord"
            onClick={() => setActiveTab('landlord_portal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'landlord_portal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            Landlord Hub
          </button>

          {/* Admin Command */}
          <button
            id="tab-admin"
            onClick={() => setActiveTab('admin_portal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all relative ${
              activeTab === 'admin_portal'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            Admin Queue
            {(openReportsCount > 0 || pendingDocsCount > 0) && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {openReportsCount + pendingDocsCount}
              </span>
            )}
          </button>

          {/* University Housing Office */}
          <button
            id="tab-housing"
            onClick={() => setActiveTab('housing_analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'housing_analytics'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            Housing Office
          </button>
        </nav>

        {/* Right Action: Report Red Flag & Current Account Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Fraud Report CTA */}
          <button
            id="quick-report-scam-btn"
            onClick={() => {
              setReportTargetListing(null);
              setIsReportModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs"
            title="Report a scam or suspicious listing"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Scam</span>
          </button>

          {/* User Profile / Switch Dropdown */}
          <div className="relative group">
            <button
              id="user-profile-menu-btn"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs transition"
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-slate-600" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-slate-200 leading-tight truncate max-w-[110px]">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentUser.role.replace('_', ' ')}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-2 hidden group-hover:block z-50">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="font-semibold text-white text-xs">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                {currentUser.studentNumber && (
                  <p className="text-[11px] font-mono text-blue-400 mt-1">Student No: {currentUser.studentNumber}</p>
                )}
                {currentUser.institution && (
                  <p className="text-[10px] text-slate-400">{currentUser.institution}</p>
                )}
              </div>

              <div className="text-[11px] font-medium text-slate-400 px-3 py-1">Select User Account:</div>
              {allUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => switchUserById(user.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between transition ${
                    user.id === currentUser.id ? 'bg-blue-600/20 text-blue-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{user.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                </button>
              ))}

              <div className="border-t border-slate-800 mt-2 pt-1 flex gap-1">
                <button
                  onClick={() => {
                    setAuthModalMode('register_student');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-1/2 text-center text-[11px] py-1.5 text-blue-400 hover:bg-slate-800 rounded"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-1/2 text-center text-[11px] py-1.5 text-slate-300 hover:bg-slate-800 rounded"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden px-3 py-2 bg-slate-950 border-t border-slate-800 overflow-x-auto flex gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
            activeTab === 'browse' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Listings
        </button>
        <button
          onClick={() => setActiveTab('smart_match')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
            activeTab === 'smart_match' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Smart Match
        </button>
        <button
          onClick={() => setActiveTab('roommates')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
            activeTab === 'roommates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Roommates
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
            activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('landlord_portal')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
            activeTab === 'landlord_portal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Landlord
        </button>
        <button
          onClick={() => setActiveTab('admin_portal')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
            activeTab === 'admin_portal' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Admin ({openReportsCount + pendingDocsCount})
        </button>
        <button
          onClick={() => setActiveTab('housing_analytics')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
            activeTab === 'housing_analytics' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Housing Office
        </button>
      </div>
    </header>
  );
};
