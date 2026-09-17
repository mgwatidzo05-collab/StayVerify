import React, { useState } from 'react';
import { Listing } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  ShieldAlert,
  MessageSquare,
  Sun,
  Droplets,
  Wifi,
  ShieldCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onOpenDetails: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onOpenDetails }) => {
  const {
    startOrOpenConversation,
    savedListingIds,
    toggleSaveListing,
    formatPrice,
    setActiveTab
  } = useApp();

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const isSaved = savedListingIds.includes(listing.id);
  const isSuspended = listing.status === 'suspended_under_review' || listing.status === 'banned';
  const mediaList = listing.media && listing.media.length > 0 ? listing.media : [];

  const landlordPhone = listing.landlordPhone || '+263 77 123 4567';
  const cleanPhone = landlordPhone.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hello ${listing.landlordName}, I saw your accommodation "${listing.title}" in ${listing.suburb} on StayVerify. I am a student interested in viewing the room. Is it still available?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaList.length > 0) {
      setCurrentImageIdx((prev) => (prev + 1) % mediaList.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaList.length > 0) {
      setCurrentImageIdx((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    }
  };

  const handleQuickInquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    startOrOpenConversation(listing.id, listing.landlordId, listing.landlordName, listing.title);
    setActiveTab('messages');
  };

  return (
    <div
      id={`listing-card-${listing.id}`}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-lg ${
        isSuspended
          ? 'border-red-300 bg-red-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 group/image">
          {mediaList.length > 0 ? (
            <img
              src={mediaList[currentImageIdx]?.url}
              alt={listing.title}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
                isSuspended ? 'filter grayscale-50' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 text-xs">
              No Photos Available
            </div>
          )}

          {/* Verification Badge (Top Left) */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <VerificationBadge tier={listing.verificationBadge} size="sm" showDetails />
          </div>

          {/* Heart / Shortlist Toggle (Top Right) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveListing(listing.id);
            }}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center shadow-sm transition"
            title={isSaved ? 'Remove from Saved' : 'Save Room'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition ${
                isSaved ? 'fill-rose-600 text-rose-600' : 'text-slate-700 hover:text-rose-600'
              }`}
            />
          </button>

          {/* Image Navigation Arrows */}
          {mediaList.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition shadow-sm z-10"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition shadow-sm z-10"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Photo Counter */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              {currentImageIdx + 1}/{mediaList.length}
            </div>
          )}

          {/* Suspended Alert */}
          {isSuspended && (
            <div className="absolute inset-x-0 top-0 bg-red-600 text-white px-2 py-1.5 text-[11px] font-bold flex items-center gap-1 justify-center z-20">
              <ShieldAlert className="w-3.5 h-3.5 text-white shrink-0" />
              <span>SUSPENDED UNDER FRAUD REVIEW</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2.5">
          {/* Suburb & Distance to NUST & Google Map */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700 truncate">
              {listing.suburb}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={listing.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address + ', ' + listing.suburb + ', Bulawayo')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2 py-0.5 rounded-md transition"
                title="Open Google Maps Location"
              >
                <MapPin className="w-3 h-3 text-rose-600" />
                <span>Map</span>
              </a>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                {listing.distanceToCampusKm} km to NUST
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(listing)}
            className="text-sm font-bold text-slate-900 leading-snug cursor-pointer hover:text-rose-600 transition line-clamp-1"
          >
            {listing.title}
          </h3>

          {/* Room Type & Spot tags */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded capitalize">
              {listing.roomType.replace('_', ' ')}
            </span>
            <span className="text-slate-500">
              {listing.availableSpots} of {listing.totalRooms} left
            </span>
          </div>

          {/* Key Utilities (Solar, Water, Wifi) */}
          <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
            {listing.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-600 flex items-center gap-1">
                {amenity.includes('Solar') && <Sun className="w-3 h-3 text-amber-500" />}
                {amenity.includes('Borehole') && <Droplets className="w-3 h-3 text-blue-500" />}
                {amenity.includes('Wi-Fi') && <Wifi className="w-3 h-3 text-teal-500" />}
                <span>{amenity}</span>
              </span>
            ))}
          </div>

          {/* Student anti-scam policy badge */}
          <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">No deposit before physical walk-through</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Buttons */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-rose-600">
            {formatPrice(listing.pricePerMonthUsd)}
          </span>
          <span className="text-xs text-slate-500">/mo</span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1"
            title={`WhatsApp Landlord (${landlordPhone})`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-800 hidden sm:inline">WhatsApp</span>
          </a>

          <button
            onClick={handleQuickInquire}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
            title="Message Landlord In-App"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
          </button>

          <button
            onClick={() => onOpenDetails(listing)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            View Room
          </button>
        </div>
      </div>
    </div>
  );
};
