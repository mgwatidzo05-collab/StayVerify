import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Headphones,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, currentUser } = useApp();
  const [inquiryType, setInquiryType] = useState('find_room');
  const [budget, setBudget] = useState('$80 - $120/mo');
  const [preferredArea, setPreferredArea] = useState('Selborne Park');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isSupportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsSupportModalOpen(false);
      setMessage('');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-600 via-rose-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">24/7 Student Booking Assistance</h3>
              <p className="text-xs text-rose-100 font-medium">Free 1-on-1 Help &bull; NUST Housing Liaison</p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Inquiry Dispatched to Housing Advisor!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                A dedicated NUST accommodation specialist has received your request and will reach out via WhatsApp/email within 15 minutes.
              </p>
            </div>
          ) : (
            <>
              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/263772000000?text=Hi%20StayVerify%20Support,%20I%20need%20help%20finding%20verified%20student%20housing%20near%20NUST"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl transition flex items-center justify-center gap-2 font-bold text-xs shadow-xs"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp Chat</span>
                </a>

                <a
                  href="tel:+263292282842"
                  className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-2xl transition flex items-center justify-center gap-2 font-bold text-xs shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>Call Campus Desk</span>
                </a>
              </div>

              {/* Free 1-on-1 Assistance Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>Request Custom Accommodation Match</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Preferred Suburb</label>
                    <select
                      value={preferredArea}
                      onChange={(e) => setPreferredArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="Selborne Park">Selborne Park (0.8km)</option>
                      <option value="Matsheumhlope">Matsheumhlope (1.8km)</option>
                      <option value="Riverside">Riverside (2.4km)</option>
                      <option value="Kumalo">Kumalo (3.2km)</option>
                      <option value="Bradfield">Bradfield (4.1km)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Budget Range</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="$60 - $80/mo">$60 - $80/mo (Sharing)</option>
                      <option value="$80 - $120/mo">$80 - $120/mo (Standard)</option>
                      <option value="$120 - $200/mo">$120 - $200/mo (Executive Ensuite)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 font-semibold mb-1">
                    Specific Requirements (e.g., Solar 24/7, Female only, Borehole)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what you're looking for (e.g. Need a single room near NUST Gate 2 with 24/7 solar power for engineering assignments...)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-sans"
                  />
                </div>

                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-[11px] text-rose-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    Our housing advisors are official university liaisons. We will never ask for payment or viewing fees.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Free Assistance Request</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
