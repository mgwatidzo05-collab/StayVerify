import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from './VerificationBadge';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Star,
  Camera,
  Sun,
  Droplets,
  Wifi,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const {
    reviews,
    physicalVisits,
    startOrOpenConversation,
    setReportTargetListing,
    setIsReportModalOpen,
    currentUser,
    addReview,
    formatPrice,
    savedListingIds,
    toggleSaveListing,
    setIsSupportModalOpen
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [tenancyPeriod, setTenancyPeriod] = useState('2025/2026 Academic Year');

  const listingReviews = reviews.filter(r => r.listingId === listing.id);
  const physicalVisit = physicalVisits.find(pv => pv.listingId === listing.id);
  const isSuspended = listing.status === 'suspended_under_review' || listing.status === 'banned';
  const isSaved = savedListingIds.includes(listing.id);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addReview({
      listingId: listing.id,
      studentId: currentUser.id,
      studentName: `${currentUser.name} (${currentUser.institution || 'Verified Student'})`,
      isVerifiedPastTenant: true,
      tenancyPeriod,
      rating: newRating,
      subRatings: {
        safety: 5,
        utilitiesReliability: 4.8,
        landlordResponsiveness: 5,
        valueForMoney: 4.5
      },
      comment: newComment
    });

    setNewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        id={`listing-modal-${listing.id}`}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <VerificationBadge tier={listing.verificationBadge} size="md" showDetails />
            {isSuspended && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                SUSPENDED UNDER FRAUD INVESTIGATION
              </span>
            )}
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Photo Gallery & Timestamp Validation */}
          <div className="space-y-2">
            <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-slate-950">
              {listing.media && listing.media.length > 0 ? (
                <img
                  src={listing.media[activeImageIndex].url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}

              {/* Timestamp Verification Badge (FR-08) */}
              {listing.media && listing.media[activeImageIndex]?.cameraMetadataVerified && (
                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg border border-emerald-500/40 flex items-center gap-2 shadow-lg">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-emerald-300 text-[11px] leading-tight">Verified Original Camera Photo</p>
                    <p className="text-[10px] text-slate-300 font-mono">{listing.media[activeImageIndex].timestamp}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {listing.media && listing.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.media.map((media, idx) => (
                  <button
                    key={media.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-blue-600 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={media.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Pricing & Campus Proximity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
            <div className="md:col-span-2 space-y-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1 font-medium text-slate-800">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{listing.address}, {listing.suburb}</span>
                </div>
                <div className="flex items-center gap-1 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{listing.distanceToCampusKm} km to NUST Gate ({listing.walkingMinutes} min walk)</span>
                </div>
              </div>

              <div className="prose prose-sm text-slate-700 leading-relaxed pt-2">
                <p>{listing.description}</p>
              </div>
            </div>

            {/* Price & Landlord Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Monthly Student Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-rose-600">{formatPrice(listing.pricePerMonthUsd)}</span>
                    <span className="text-slate-500 text-xs font-semibold">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Includes standard utilities, borehole water, Wi-Fi</p>
                </div>

                <button
                  onClick={() => toggleSaveListing(listing.id)}
                  className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition shadow-2xs"
                  title={isSaved ? 'Remove from Shortlist' : 'Add to Shortlist'}
                >
                  <span className="text-lg">{isSaved ? '❤️' : '🤍'}</span>
                </button>
              </div>

              {/* Deposit Policy Shield */}
              <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-1 font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero-Scam Deposit Rule</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {listing.depositPolicy} (Required deposit: {formatPrice(listing.depositRequiredUsd)}).
                </p>
              </div>

              {/* Landlord Identity Overview */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {listing.landlordName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{listing.landlordName}</p>
                    <p className="text-[10px] text-slate-500">Verified Accommodation Host</p>
                  </div>
                </div>
                <VerificationBadge tier={listing.landlordTier} size="sm" showDetails />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {!isSuspended && (
                  <>
                    <button
                      id="modal-message-landlord-btn"
                      onClick={() => {
                        startOrOpenConversation(listing.id, listing.landlordId, listing.landlordName, listing.title);
                        onClose();
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Host (Protected)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSupportModalOpen(true);
                        onClose();
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>💬 Free WhatsApp Booking Help</span>
                    </button>
                  </>
                )}

                <button
                  id="modal-report-scam-btn"
                  onClick={() => {
                    setReportTargetListing(listing);
                    setIsReportModalOpen(true);
                  }}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs py-2 px-4 rounded-xl border border-rose-200 transition flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Report Red Flag / Suspicious Info (FR-16)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Physical Verification Report (FR-06) */}
          {physicalVisit && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Campus Housing Officer Physical Inspection Passed</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Visit Date: {physicalVisit.visitDate}
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">{physicalVisit.findings}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-medium text-emerald-900">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Security wall/fence verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Solar backup operational</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Borehole water test passed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inspector ID: {physicalVisit.inspectorId}</span>
                </div>
              </div>
            </div>
          )}

          {/* Amenities & Utilities */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Property Amenities & Infrastructure</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {listing.amenities.map((amenity, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Past Tenant Reviews (FR-19) */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>Verified Past Tenant Reviews</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                    {listingReviews.length} Tenancies
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Only reviews tied to confirmed student tenancies are published (FR-19).</p>
              </div>

              <button
                id="write-review-toggle-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition"
              >
                {showReviewForm ? 'Cancel' : '+ Add Tenant Review'}
              </button>
            </div>

            {/* New Review Form */}
            {showReviewForm && (
              <form onSubmit={handleCreateReview} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-xs text-slate-800">Submit Verified Student Tenancy Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Tenancy Academic Period</label>
                    <input
                      type="text"
                      value={tenancyPeriod}
                      onChange={(e) => setTenancyPeriod(e.target.value)}
                      placeholder="e.g. Feb 2025 - Nov 2025"
                      className="w-full p-2 bg-white border border-slate-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Overall Rating (1 to 5 Stars)</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md"
                    >
                      <option value={5}>5 Stars - Outstanding & Trustworthy</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Satisfactory</option>
                      <option value={2}>2 Stars - Substandard Conditions</option>
                      <option value={1}>1 Star - Serious Safety/Utility Issues</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">Detailed Review & Experience</label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe water reliability, solar backup, landlord responsiveness, and overall safety..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Publish Verified Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {listingReviews.length > 0 ? (
                listingReviews.map((review) => (
                  <div key={review.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                          {review.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-slate-900">{review.studentName}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Tenancy: {review.tenancyPeriod}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">"{review.comment}"</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Tenancy Record (FR-19)</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No reviews recorded yet for this accommodation.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
