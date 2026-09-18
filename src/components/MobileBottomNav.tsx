import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Building2,
  Lock
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenDrawer?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = () => {
  const {
    activeTab,
    setActiveTab,
    studentUser,
    landlordUser,
    isAdminAuthenticated
  } = useApp();

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Portals Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-lg transition-transform"
    >
      <div className="grid grid-cols-3 h-16 max-w-md mx-auto px-2">
        {/* 1. Student Portal */}
        <button
          id="mobile-nav-student"
          onClick={() => setActiveTab('browse')}
          className={`flex flex-col items-center justify-center gap-1 transition relative ${
            activeTab === 'browse' || activeTab === 'messages'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <GraduationCap className="w-5 h-5" />
            {studentUser && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Student Portal</span>
          {(activeTab === 'browse' || activeTab === 'messages') && (
            <span className="absolute bottom-1 w-2 h-1 rounded-full bg-rose-600"></span>
          )}
        </button>

        {/* 2. Landlord Portal */}
        <button
          id="mobile-nav-landlord"
          onClick={() => setActiveTab('landlord_portal')}
          className={`flex flex-col items-center justify-center gap-1 transition relative ${
            activeTab === 'landlord_portal'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Building2 className="w-5 h-5" />
            {landlordUser && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Landlord Portal</span>
          {activeTab === 'landlord_portal' && (
            <span className="absolute bottom-1 w-2 h-1 rounded-full bg-emerald-600"></span>
          )}
        </button>

        {/* 3. Admin Portal */}
        <button
          id="mobile-nav-admin"
          onClick={() => setActiveTab('admin_portal')}
          className={`flex flex-col items-center justify-center gap-1 transition relative ${
            activeTab === 'admin_portal'
              ? 'text-purple-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Lock className="w-5 h-5" />
            {isAdminAuthenticated && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-500 border border-white"></span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Admin Portal</span>
          {activeTab === 'admin_portal' && (
            <span className="absolute bottom-1 w-2 h-1 rounded-full bg-purple-600"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
