import React from 'react';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';

export const StayVerifyTestimonials: React.FC = () => {
  const TESTIMONIALS = [
    {
      id: 1,
      name: 'Tendai Moyo',
      program: 'Computer Science (Part 3)',
      property: 'Selborne Executive Student Lodge',
      suburb: 'Selborne Park',
      rating: 5,
      date: 'August 2026',
      review: 'Stayed in Selborne Park for two semesters. The solar inverter runs 24/7 during power cuts and the borehole water is crystal clean. Never had to deal with fake Facebook middlemen asking for viewing money.',
      verified: true
    },
    {
      id: 2,
      name: 'Chipo Dube',
      program: 'Applied Biology & Biochemistry (Part 2)',
      property: 'Matsheumhlope Quiet Study Cottages',
      suburb: 'Matsheumhlope',
      rating: 5,
      date: 'July 2026',
      review: 'The physical inspection badge gave me full peace of mind. My landlord Mrs. Sibanda is respectful, respects quiet study hours, and we signed a legitimate lease with zero surprises.',
      verified: true
    },
    {
      id: 3,
      name: 'Farai Katsande',
      program: 'Civil & Water Engineering (Part 4)',
      property: 'Riverside Garden Student Village',
      suburb: 'Riverside',
      rating: 5,
      date: 'June 2026',
      review: 'Used the roommate pairing feature to find a fellow engineering student. We share an en-suite flat, split utilities equally, and the combi stop to NUST gate is literally 3 minutes away.',
      verified: true
    }
  ];

  return (
    <div className="my-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Student Reviews</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Trusted by 2,400+ NUST Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real feedback from verified student tenants living in Bulawayo off-campus housing.
          </p>
        </div>

        {/* Trust Score Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0">
          <div className="text-center">
            <div className="text-xl font-black text-emerald-800 leading-none">4.8</div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase">out of 5</div>
          </div>
          <div className="h-8 w-px bg-emerald-200" />
          <div>
            <div className="flex text-emerald-600 text-sm">
              {'★'.repeat(5)}
            </div>
            <div className="text-xs font-bold text-slate-800">Trust Score Verified</div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Stars & Date */}
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 text-sm">
                  {'★'.repeat(t.rating)}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{t.date}</span>
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{t.review}"
              </p>
            </div>

            {/* Author info */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>{t.name}</span>
                  {t.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{t.program}</div>
              </div>

              <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full shrink-0">
                {t.suburb}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
