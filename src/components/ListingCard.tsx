import React, { useState } from 'react';
import { Listing } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  ShieldAlert,
  MessageSquare,
  Eye,
  Star,
  Users,
  Sun,
  Droplets,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  Camera,
  Heart,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onOpenDetails: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onOpenDetails }) => {
  const {
    startOrOpenConversation,
    setReportTargetListing,
    setIsReportModalOpen,
    savedListingIds,
    toggleSaveListing,
    formatPrice,
    setActiveTab
  } = useApp();

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const isSaved = savedListingIds.includes(listing.id);
  const isSuspended = listing.status === 'suspended_under_review' || listing.status === 'banned';
  const mediaList = listing.media && listing.media.length > 0 ? listing.media : [];

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
      className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl ${
        isSuspended
          ? 'border-red-300 bg-red-50/20 shadow-xs'
          : listing.verificationBadge === 'physically_verified'
          ? 'border-slate-200 hover:border-rose-400'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Photo Carousel Container with Badges */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 group/image">
          {mediaList.length > 0 ? (
            <img
              src={mediaList[currentImageIdx]?.url}
              alt={listing.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 ${
                isSuspended ? 'filter grayscale-50' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
              No Photos Available
            </div>
          )}

          {/* Verification Badge (Top Left) */}
          <div className="absolute top-3 left-3 z-10">
            <VerificationBadge tier={listing.verificationBadge} size="sm" showDetails />
          </div>

          {/* Heart / Wishlist Shortlist Toggle (Top Right) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveListing(listing.id);
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center shadow-md transition transform hover:scale-110 active:scale-95"
            title={isSaved ? 'Remove from Shortlist' : 'Add to Shortlist'}
          >
            <Heart
              className={`w-4 h-4 transition ${
                isSaved ? 'fill-rose-600 text-rose-600' : 'text-slate-700 hover:text-rose-600'
              }`}
            />
          </button>

          {/* Image Navigation Arrows (Hover visible) */}
          {mediaList.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition shadow-md z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition shadow-md z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Photo Counter Badge & EXIF verification */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            {mediaList[currentImageIdx]?.cameraMetadataVerified && !isSuspended ? (
              <div className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.8 rounded-md font-mono flex items-center gap-1 border border-slate-700/60 shadow-xs">
                <Camera className="w-3 h-3 text-emerald-400" />
                <span>EXIF Verified</span>
              </div>
            ) : <div />}

            {mediaList.length > 1 && (
              <div className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                {currentImageIdx + 1}/{mediaList.length}
              </div>
            )}
          </div>

          {/* Suspended Alert Banner */}
          {isSuspended && (
            <div className="absolute inset-x-0 top-0 bg-red-600/95 text-white px-3 py-2 text-xs font-bold flex items-center gap-1.5 justify-center backdrop-blur-xs z-20">
              <ShieldAlert className="w-4 h-4 text-white shrink-0" />
              <span>SUSPENDED UNDER FRAUD INVESTIGATION</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          {/* Location & Walking Distance */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1 font-semibold text-slate-700 truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">{listing.suburb}, Bulawayo</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0 font-medium">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{listing.distanceToCampusKm} km &bull; {listing.walkingMinutes} min walk</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(listing)}
            className="text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-rose-600 transition line-clamp-2"
          >
            {listing.title}
          </h3>

          {/* Room Type & Availability Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded capitalize">
              {listing.roomType.replace('_', ' ')}
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
              {listing.availableSpots} of {listing.totalRooms} beds left
            </span>
            {listing.genderPreference !== 'any' && (
              <span className="text-[11px] bg-purple-50 text-purple-800 font-medium px-2 py-0.5 rounded capitalize">
                {listing.genderPreference.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Essential Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {listing.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded font-medium">
                {amenity.includes('Solar') && <Sun className="w-3 h-3 text-amber-500" />}
                {amenity.includes('Borehole') && <Droplets className="w-3 h-3 text-blue-500" />}
                {amenity.includes('Wi-Fi') && <Wifi className="w-3 h-3 text-teal-500" />}
                {amenity.includes('Fence') && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                <span>{amenity}</span>
              </span>
            ))}
            {listing.amenities.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium self-center">
                +{listing.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Safe Deposit Tag (FR-15 Anti-Scam) */}
          <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-bold">Zero-Scam Policy:</span> {listing.depositPolicy}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Action Buttons */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Pricing */}
        <div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Starting From</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-600">
              {formatPrice(listing.pricePerMonthUsd)}
            </span>
            <span className="text-xs text-slate-500 font-medium">/month</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleQuickInquire}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
            title="Chat with Landlord"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </button>

          <button
            onClick={() => onOpenDetails(listing)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-rose-600/20"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
