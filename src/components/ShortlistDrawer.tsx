import React from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { VerificationBadge } from './VerificationBadge';
import {
  X,
  Heart,
  Trash2,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ShortlistDrawerProps {
  onOpenDetails: (listing: Listing) => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({ onOpenDetails }) => {
  const {
    savedListingIds,
    toggleSaveListing,
    listings,
    isShortlistOpen,
    setIsShortlistOpen,
    formatPrice,
    startOrOpenConversation,
    setActiveTab
  } = useApp();

  if (!isShortlistOpen) return null;

  const savedListings = listings.filter(l => savedListingIds.includes(l.id));

  const handleInquireAll = () => {
    if (savedListings.length > 0) {
      const first = savedListings[0];
      startOrOpenConversation(first.id, first.landlordId, first.landlordName, first.title);
      setIsShortlistOpen(false);
      setActiveTab('messages');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Your Saved Shortlist</h3>
              <p className="text-[11px] text-slate-400">
                {savedListings.length} {savedListings.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShortlistOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedListings.length > 0 ? (
            savedListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-3 border border-slate-200 transition space-y-2.5"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <img
                      src={listing.media[0]?.url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-rose-600">
                          {formatPrice(listing.pricePerMonthUsd)} <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                        </span>
                        <button
                          onClick={() => toggleSaveListing(listing.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Remove from Shortlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4
                        onClick={() => {
                          onOpenDetails(listing);
                          setIsShortlistOpen(false);
                        }}
                        className="text-xs font-bold text-slate-900 truncate hover:text-rose-600 cursor-pointer"
                      >
                        {listing.title}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{listing.suburb} &bull; {listing.distanceToCampusKm} km</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <VerificationBadge tier={listing.verificationBadge} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      onOpenDetails(listing);
                      setIsShortlistOpen(false);
                    }}
                    className="flex-1 bg-white hover:bg-slate-200 text-slate-800 text-xs font-semibold py-1.5 rounded-lg border border-slate-300 transition text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      startOrOpenConversation(listing.id, listing.landlordId, listing.landlordName, listing.title);
                      setIsShortlistOpen(false);
                      setActiveTab('messages');
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Inquire</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Your shortlist is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap the heart icon on any accommodation card to bookmark and compare options side-by-side.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {savedListings.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
            <button
              onClick={handleInquireAll}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-rose-400" />
              <span>Contact Landlord from Shortlist</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
