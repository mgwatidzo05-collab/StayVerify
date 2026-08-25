import React from 'react';
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
  Camera
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onOpenDetails: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onOpenDetails }) => {
  const { startOrOpenConversation, setReportTargetListing, setIsReportModalOpen } = useApp();

  const isSuspended = listing.status === 'suspended_under_review' || listing.status === 'banned';
  const mainImage = listing.media && listing.media.length > 0 ? listing.media[0] : null;

  return (
    <div
      id={`listing-card-${listing.id}`}
      className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isSuspended
          ? 'border-red-300 bg-red-50/20 shadow-xs'
          : listing.verificationBadge === 'physically_verified'
          ? 'border-emerald-200 hover:border-emerald-400 hover:shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={listing.title}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
                isSuspended ? 'filter grayscale-50' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
              No Photo Available
            </div>
          )}

          {/* Verification Badge (Top Left) */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <VerificationBadge tier={listing.verificationBadge} size="sm" showDetails />
          </div>

          {/* Suspended Alert Banner */}
          {isSuspended && (
            <div className="absolute inset-x-0 top-0 bg-red-600/95 text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 justify-center backdrop-blur-xs">
              <ShieldAlert className="w-4 h-4 text-white shrink-0" />
              <span>SUSPENDED PENDING SCAM INVESTIGATION (FR-18)</span>
            </div>
          )}

          {/* Timestamped Photo Verification Tag (FR-08) */}
          {mainImage?.cameraMetadataVerified && !isSuspended && (
            <div className="absolute bottom-2.5 left-2.5 z-10 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.8 rounded-md font-mono flex items-center gap-1 border border-slate-700/60 shadow-xs">
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>Timestamp Verified EXIF</span>
            </div>
          )}

          {/* Price Tag (Top Right) */}
          <div className="absolute top-2.5 right-2.5 bg-slate-900/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
            <span className="text-emerald-400 font-extrabold text-sm">${listing.pricePerMonthUsd}</span>
            <span className="text-slate-300 font-normal text-[11px]"> /mo</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Location & Distance */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 font-medium text-slate-700 truncate">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{listing.suburb}, Bulawayo</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0 font-medium">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{listing.distanceToCampusKm} km ({listing.walkingMinutes} min walk to NUST)</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(listing)}
            className="text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-blue-600 transition line-clamp-2 mb-2"
          >
            {listing.title}
          </h3>

          {/* Room type & gender preference tag */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[11px] bg-blue-50 text-blue-800 font-medium px-2 py-0.5 rounded capitalize">
              {listing.roomType.replace('_', ' ')}
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
              {listing.availableSpots} of {listing.totalRooms} spots available
            </span>
            {listing.genderPreference !== 'any' && (
              <span className="text-[11px] bg-purple-50 text-purple-800 font-medium px-2 py-0.5 rounded capitalize">
                {listing.genderPreference.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Deposit Policy Anti-Scam Highlight */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 text-[11px] text-slate-600 mb-3 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-semibold text-slate-800">Deposit Rule:</span> {listing.depositPolicy}
            </div>
          </div>

          {/* Essential Amenities Grid */}
          <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
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

          {/* Landlord Name & Ratings */}
          <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 text-slate-600">
            <span className="truncate font-medium text-slate-700">Host: {listing.landlordName}</span>
            <div className="flex items-center gap-1 font-semibold text-slate-800 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{listing.ratingAverage}</span>
              <span className="text-slate-400 text-[11px] font-normal">({listing.ratingCount} reviews)</span>
            </div>
          </div>

          {/* Scam Warnings if any */}
          {listing.scamWarningFlags && listing.scamWarningFlags.length > 0 && (
            <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1 text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Security Flags Detected:</span>
              </div>
              {listing.scamWarningFlags.map((flag, i) => (
                <div key={i} className="pl-4 text-[10px] leading-tight">• {flag}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          id={`view-listing-btn-${listing.id}`}
          onClick={() => onOpenDetails(listing)}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        {!isSuspended && (
          <button
            id={`message-landlord-btn-${listing.id}`}
            onClick={() => startOrOpenConversation(listing.id, listing.landlordId, listing.landlordName, listing.title)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs py-2 px-3 rounded-lg border border-blue-200 transition flex items-center justify-center gap-1"
            title="Safe In-Platform Chat (FR-13)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Message</span>
          </button>
        )}

        <button
          id={`report-card-btn-${listing.id}`}
          onClick={() => {
            setReportTargetListing(listing);
            setIsReportModalOpen(true);
          }}
          className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 p-2 rounded-lg border border-slate-200 transition"
          title="Report this listing for scam or suspicious activity (FR-16)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
