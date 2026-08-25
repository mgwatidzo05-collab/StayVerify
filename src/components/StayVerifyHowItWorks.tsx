import React from 'react';
import { Search, MessageSquare, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StayVerifyHowItWorks: React.FC = () => {
  const { setActiveTab, setIsSupportModalOpen } = useApp();

  const STEPS = [
    {
      step: '01',
      title: 'Discover & Filter',
      description: 'Search from 240+ student rooms and cottages near NUST. Filter by suburb, budget, solar power, and physical verification level.',
      icon: Search,
      badge: 'Verified Photos & EXIF'
    },
    {
      step: '02',
      title: 'Chat & Book Inspection',
      description: 'Connect directly with vetted property hosts. Message securely on platform with zero risk of upfront fee extortion before you see the room.',
      icon: MessageSquare,
      badge: 'Protected Messaging'
    },
    {
      step: '03',
      title: 'Secure & Move In',
      description: 'Finalize your student tenancy with institutional lease backing, verified landlord deeds, and 100% peace of mind.',
      icon: ShieldCheck,
      badge: 'Zero-Scam Guarantee'
    }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 my-10 border border-slate-800 relative overflow-hidden shadow-xl">
      {/* Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Simple, Transparent & 100% Free</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Book Your Student Home in 3 Easy Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Say goodbye to fake Facebook agents, phantom deposit demands, and unsafe unverified accommodation.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {STEPS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-6 relative hover:border-slate-600 transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black text-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-600 font-mono">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Badge */}
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <span className="inline-block text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-medium mb-2">
                      {item.badge}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Need help finding accommodation near your NUST department?</h4>
            <p className="text-xs text-slate-400">Our student housing support team offers free 1-on-1 booking guidance via WhatsApp.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <span>WhatsApp 24/7 Support</span>
            </button>
            <button
              onClick={() => setActiveTab('smart_match')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <span>Match with Roommate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
