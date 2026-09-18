import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Home,
  Building2,
  Lock,
  MessageSquare,
  Heart,
  ShieldAlert,
  X,
  GraduationCap,
  Key,
  ShieldCheck,
  ChevronRight,
  LogOut,
  MapPin,
  HelpCircle
} from 'lucide-react';

interface MobilePortalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobilePortalDrawer: React.FC<MobilePortalDrawerProps> = ({
  isOpen,
  onClose
}) => {
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
    setIsShortlistOpen,
    setIsReportModalOpen,
    setReportTargetListing
  } = useApp();

  if (!isOpen) return null;

  const handleSelectTab = (tab: any) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>StayVerify Portals</span>
                <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">NUST</span>
              </div>
              <p className="text-[10px] text-slate-500">Select stakeholder portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Portal List */}
        <div className="p-4 space-y-4 flex-1">
          {/* Active User Badges */}
          {(studentUser || landlordUser || isAdminAuthenticated) && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Sessions</div>
              {studentUser && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                    <span className="truncate max-w-[130px]">{studentUser.name}</span>
                  </div>
                  <button onClick={logoutStudent} className="text-rose-500 hover:text-rose-700 text-[11px] font-bold">
                    Log out
                  </button>
                </div>
              )}
              {landlordUser && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate max-w-[130px]">{landlordUser.name}</span>
                  </div>
                  <button onClick={logoutLandlord} className="text-emerald-600 hover:text-emerald-800 text-[11px] font-bold">
                    Exit
                  </button>
                </div>
              )}
              {isAdminAuthenticated && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-purple-800 font-bold">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Administrator</span>
                  </div>
                  <button onClick={logoutAdmin} className="text-purple-600 hover:text-purple-800 text-[11px] font-bold">
                    Lock
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Core Portals Section (Strictly 3 Portals) */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Select Portal
            </div>

            {/* 1. Student Portal */}
            <button
              onClick={() => handleSelectTab('browse')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                activeTab === 'browse' || activeTab === 'messages'
                  ? 'bg-rose-50 text-rose-900 border border-rose-200 font-bold'
                  : 'hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'browse' || activeTab === 'messages' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'}`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Student Portal</span>
                    {studentUser && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">Browse rooms, chat & verify landlords</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 2. Landlord Portal */}
            <button
              onClick={() => handleSelectTab('landlord_portal')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                activeTab === 'landlord_portal'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                  : 'hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'landlord_portal' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Landlord Portal</span>
                    {landlordUser ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    ) : (
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded">Access Key</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">List accommodation & submit title deeds</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 3. Admin Portal */}
            <button
              onClick={() => handleSelectTab('admin_portal')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                activeTab === 'admin_portal'
                  ? 'bg-purple-50 text-purple-900 border border-purple-200 font-bold'
                  : 'hover:bg-slate-50 text-slate-700 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'admin_portal' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Admin Portal</span>
                    {isAdminAuthenticated && (
                      <span className="text-[9px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded font-bold">Unlocked</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">Landlord approvals, audit logs & fraud cases</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Shortcuts & Safety
            </div>

            {/* Saved Rooms */}
            <button
              onClick={() => {
                setIsShortlistOpen(true);
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${savedListingIds.length > 0 ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} />
                <span>Saved Rooms Shortlist</span>
              </div>
              {savedListingIds.length > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  {savedListingIds.length}
                </span>
              )}
            </button>

            {/* Report a Scammer */}
            <button
              onClick={() => {
                setReportTargetListing(null);
                setIsReportModalOpen(true);
                onClose();
              }}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report Suspicious Listing or Fraud</span>
            </button>
          </div>

          {/* PWA Install Drawer Component */}
          <div className="pt-2">
            <PWAInstallButton variant="drawer" />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-center text-[11px] text-slate-400">
          StayVerify Bulawayo &bull; NUST Student Housing
        </div>
      </div>
    </div>
  );
};
