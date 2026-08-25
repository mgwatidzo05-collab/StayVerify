import React from 'react';
import { Sparkles, Bus, Users, FileCheck2, Gift, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StayVerifyPerksBanner: React.FC = () => {
  const { setActiveTab } = useApp();

  const PERKS = [
    {
      title: 'Free Roommate Matching',
      desc: 'Pair with verified NUST co-tenants by study hours, cleanliness, and budget.',
      icon: Users,
      tag: '100% Free'
    },
    {
      title: 'Verified Lease Agreement',
      desc: 'Download court-standard student tenancy contracts approved by university legal liaison.',
      icon: FileCheck2,
      tag: 'SRS Verified'
    },
    {
      title: 'Campus Shuttle Discount',
      desc: 'Save 20% on weekly student commuter shuttles between Selborne Park and NUST Main Gate.',
      icon: Bus,
      tag: 'Save $15/mo'
    },
    {
      title: 'Zero-Fee Guarantee',
      desc: 'Students never pay viewing fees, registration fees, or agency commissions. Ever.',
      icon: Gift,
      tag: 'Zero Fees'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-rose-200/80 mb-10 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>StayVerify+ Student Perks</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            More Than Just Accommodation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Unlock exclusive university student benefits designed to make your semester safe, affordable, and stress-free.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('smart_match')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 shrink-0 self-start lg:self-center"
        >
          <span>Explore Roommate & Study Perks</span>
          <ArrowRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <div
              key={perk.title}
              className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-rose-100/80 shadow-2xs hover:border-rose-300 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  {perk.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{perk.title}</h4>
              <p className="text-xs text-slate-500 leading-snug">{perk.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
