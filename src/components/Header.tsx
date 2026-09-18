import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { MobilePortalDrawer } from './MobilePortalDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import {
  ShieldCheck,
  Home,
  Building2,
  Lock,
  Heart,
  LogOut,
  GraduationCap,
  Key,
  Menu,
  MessageSquare
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    studentUser,
    logoutStudent,
    landlordUser,
    logoutLandlord,
    isAdminAuthenticated,
    logoutAdmin,
    savedListingIds,
    setIsShortlistOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
            
            {/* Left: Logo / Title */}
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => setActiveTab('browse')}
            >
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                    StayVerify
                  </span>
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                    NUST
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden md:block">
                  Verified Student Accommodation Network
                </p>
              </div>
            </div>

            {/* Desktop Navigation (Exactly 3 Portals) */}
            <nav className="hidden lg:flex items-center gap-2">
              {/* 1. Student Portal */}
              <button
                id="tab-student"
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'browse' || activeTab === 'messages'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Portal</span>
                {studentUser && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>

              {/* 2. Landlord Portal */}
              <button
                id="tab-landlord"
                onClick={() => setActiveTab('landlord_portal')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'landlord_portal'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Landlord Portal</span>
                {landlordUser ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                ) : (
                  <Key className="w-3 h-3 text-slate-400" />
                )}
              </button>

              {/* 3. Admin Portal */}
              <button
                id="tab-admin"
                onClick={() => setActiveTab('admin_portal')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'admin_portal'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Admin Portal</span>
                {isAdminAuthenticated && (
                  <span className="bg-purple-100 text-purple-700 text-[9px] px-1 py-0.2 rounded font-bold">
                    Unlocked
                  </span>
                )}
              </button>
            </nav>

            {/* Right Area: Install Button, Shortlist, and Mobile Menu Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Install App Button on Desktop/Header */}
              <PWAInstallButton variant="header" className="hidden sm:flex" />

              {/* Shortlist icon */}
              <button
                id="shortlist-btn"
                onClick={() => setIsShortlistOpen(true)}
                className="relative p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200"
                title="Saved Rooms"
              >
                <Heart className={`w-4 h-4 ${savedListingIds.length > 0 ? 'fill-rose-600 text-rose-600' : ''}`} />
                {savedListingIds.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {savedListingIds.length}
                  </span>
                )}
              </button>

              {/* Active Session Chips on Medium+ screens */}
              {activeTab === 'browse' && studentUser && (
                <div className="hidden md:flex items-center gap-1.5 bg-rose-50 border border-rose-200 py-1 px-2.5 rounded-xl text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-bold text-rose-900 truncate max-w-[100px]">{studentUser.name}</span>
                  <button
                    onClick={logoutStudent}
                    className="text-rose-500 hover:text-rose-700 font-semibold text-[11px] ml-0.5"
                    title="Log out as student"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              )}

              {activeTab === 'landlord_portal' && landlordUser && (
                <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 py-1 px-2.5 rounded-xl text-xs">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-emerald-900 truncate max-w-[100px]">{landlordUser.name}</span>
                  <button
                    onClick={logoutLandlord}
                    className="text-emerald-600 hover:text-emerald-800 font-semibold text-[11px] ml-0.5"
                    title="Exit landlord session"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              )}

              {activeTab === 'admin_portal' && isAdminAuthenticated && (
                <div className="hidden md:flex items-center gap-1.5 bg-purple-50 border border-purple-200 py-1 px-2.5 rounded-xl text-xs">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-bold text-purple-900">Admin</span>
                  <button
                    onClick={logoutAdmin}
                    className="text-purple-600 hover:text-purple-800 font-semibold text-[11px] ml-0.5"
                    title="Lock admin portal"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Mobile Menu Hamburger Button (Accessible on mobile/tablet) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex lg:hidden items-center gap-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                title="All Portals & Menu"
                aria-label="Open Portals Menu"
              >
                <Menu className="w-5 h-5 text-slate-800" />
                <span className="text-xs font-bold sm:hidden">Portals</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Portal Drawer */}
      <MobilePortalDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Bottom Sticky Navigation */}
      <MobileBottomNav
        onOpenDrawer={() => setIsMobileMenuOpen(true)}
      />
    </>
  );
};
