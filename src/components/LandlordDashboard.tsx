import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationTier, DocumentType, Listing } from '../types';
import { VerificationBadge } from './VerificationBadge';
import {
  Building2,
  PlusCircle,
  FileCheck2,
  Upload,
  ShieldCheck,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  HelpCircle,
  Sparkles,
  Sun,
  Droplets,
  Wifi,
  ShieldAlert
} from 'lucide-react';

export const LandlordDashboard: React.FC = () => {
  const {
    currentUser,
    listings,
    documents,
    uploadVerificationDocument,
    addListing,
    setSelectedListing
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_listings' | 'create_listing' | 'verification_docs'>('my_listings');

  // Form states for creating a new listing (FR-07, FR-08, FR-12)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('Riverside');
  const [distanceKm, setDistanceKm] = useState(1.2);
  const [walkingMinutes, setWalkingMinutes] = useState(15);
  const [pricePerMonth, setPricePerMonth] = useState(110);
  const [depositRequired, setDepositRequired] = useState(50);
  const [depositPolicy, setDepositPolicy] = useState('Pay deposit only after physical walk-through and signing key exchange.');
  const [roomType, setRoomType] = useState<Listing['roomType']>('two_sharing');
  const [totalRooms, setTotalRooms] = useState(4);
  const [availableSpots, setAvailableSpots] = useState(2);
  const [genderPreference, setGenderPreference] = useState<Listing['genderPreference']>('any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Solar Power (24/7)',
    'Borehole Water',
    'Fiber Wi-Fi'
  ]);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80');
  const [photoCaption, setPhotoCaption] = useState('Master study bedroom with natural lighting');
  const [verifyTimestampExif, setVerifyTimestampExif] = useState(true);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [creationSuccess, setCreationSuccess] = useState<string | null>(null);

  // Document upload form states (FR-02)
  const [docType, setDocType] = useState<DocumentType>('title_deed');
  const [docNumber, setDocNumber] = useState('');
  const [fileName, setFileName] = useState('Title_Deed_Property_2026.pdf');
  const [docSuccess, setDocSuccess] = useState(false);

  const myListings = listings.filter(l => l.landlordId === currentUser.id);
  const myDocuments = documents.filter(d => d.landlordId === currentUser.id);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setCreationError(null);
    setCreationSuccess(null);

    // Enforce FR-08 (Must have at least one timestamped verified photo)
    if (!photoUrl.trim()) {
      setCreationError('FR-08 Requirement: At least one photo is required to prevent stock image fraud.');
      return;
    }

    const currentBadge: VerificationTier = currentUser.landlordVerificationTier || 'unverified';

    const result = addListing({
      landlordId: currentUser.id,
      landlordName: currentUser.name,
      landlordEmail: currentUser.email,
      landlordTier: currentBadge,
      title,
      description,
      address,
      suburb,
      distanceToCampusKm: Number(distanceKm),
      walkingMinutes: Number(walkingMinutes),
      pricePerMonthUsd: Number(pricePerMonth),
      depositRequiredUsd: Number(depositRequired),
      depositPolicy,
      roomType,
      totalRooms: Number(totalRooms),
      availableSpots: Number(availableSpots),
      genderPreference,
      amenities: selectedAmenities,
      verificationBadge: currentBadge,
      status: 'active',
      media: [
        {
          id: `med-${Date.now()}`,
          url: photoUrl,
          caption: photoCaption,
          timestamp: verifyTimestampExif ? `${new Date().toISOString().split('T')[0]} (Verified Camera EXIF)` : 'Timestamp Missing',
          cameraMetadataVerified: verifyTimestampExif,
          isOriginalChecked: true
        }
      ]
    });

    if (result.success && result.listing) {
      setCreationSuccess(`Listing "${title}" created successfully! Published under tier: ${currentBadge.replace('_', ' ')}.`);
      setTitle('');
      setDescription('');
      setAddress('');
      setActiveTab('my_listings');
    } else {
      setCreationError(result.error || 'Failed to publish listing due to fraud check rejection.');
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    uploadVerificationDocument({
      landlordId: currentUser.id,
      landlordName: currentUser.name,
      documentType: docType,
      documentNumber: docNumber || `DOC-${Date.now().toString().slice(-6)}`,
      fileUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=80',
      fileName
    });
    setDocSuccess(true);
    setTimeout(() => setDocSuccess(false), 4000);
  };

  return (
    <div id="landlord-dashboard" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Landlord & Letting Agent Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Publish verified student accommodation, upload title deeds / municipal rates for admin verification, and establish trust with incoming NUST students.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Your Verification Status</p>
            <VerificationBadge tier={currentUser.landlordVerificationTier || 'unverified'} size="md" showDetails />
          </div>
        </div>
      </div>

      {/* Portal Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          id="landlord-tab-listings"
          onClick={() => setActiveTab('my_listings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'my_listings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Listings ({myListings.length})</span>
        </button>

        <button
          id="landlord-tab-create"
          onClick={() => setActiveTab('create_listing')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'create_listing'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>+ Add New Listing</span>
        </button>

        <button
          id="landlord-tab-docs"
          onClick={() => setActiveTab('verification_docs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'verification_docs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-blue-400" />
          <span>Proof Documents & Badge Upgrade</span>
        </button>
      </div>

      {/* Tab: My Listings */}
      {activeTab === 'my_listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Your Active Accommodation Units</h2>
            <button
              onClick={() => setActiveTab('create_listing')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              + Publish Listing
            </button>
          </div>

          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-slate-100">
                    {listing.media && listing.media[0] && (
                      <img src={listing.media[0].url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute top-2 left-2">
                      <VerificationBadge tier={listing.verificationBadge} size="sm" />
                    </div>
                    <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-xs font-bold px-2 py-0.5 rounded">
                      ${listing.pricePerMonthUsd} /mo
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm truncate">{listing.title}</h3>
                    <p className="text-xs text-slate-500">{listing.address}, {listing.suburb}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-600 font-medium">Spots: {listing.availableSpots} / {listing.totalRooms}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {listing.viewsCount} views
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 rounded-lg transition"
                  >
                    View & Edit Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Properties Listed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your off-campus student accommodation to connect directly with students searching for safe housing.
              </p>
              <button
                onClick={() => setActiveTab('create_listing')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Create First Listing
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Create Listing (FR-07, FR-08, FR-12) */}
      {activeTab === 'create_listing' && (
        <form onSubmit={handleCreateListing} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>List New Verified Student Accommodation</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                UC-02 Flow
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              All listings require verified timestamped photos to protect students against stolen images (FR-08).
            </p>
          </div>

          {creationError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Fraud Prevention Block (FR-12):</span>
                {creationError}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block font-bold text-slate-700">Listing Headline / Title</label>
              <input
                type="text"
                placeholder="e.g. Modern Student Cottage with 24/7 Solar & Borehole"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block font-bold text-slate-700">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Describe study areas, safety perimeter, solar system capacity, borehole water, quiet hours..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Physical Street Address</label>
              <input
                type="text"
                placeholder="e.g. 24 Jacaranda Crescent"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Suburb / Location</label>
              <select
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="Riverside">Riverside (Adjacent to NUST)</option>
                <option value="Selborne Park">Selborne Park (Near Back Gate)</option>
                <option value="Woodlands">Woodlands</option>
                <option value="Matsheumhlope">Matsheumhlope</option>
                <option value="Bradfield">Bradfield</option>
                <option value="Bulawayo CBD">Bulawayo CBD</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Distance to NUST Campus (km)</label>
              <input
                type="number"
                step="0.1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Estimated Walking Time (Minutes)</label>
              <input
                type="number"
                value={walkingMinutes}
                onChange={(e) => setWalkingMinutes(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Monthly Rent per Student (USD)</label>
              <input
                type="number"
                value={pricePerMonth}
                onChange={(e) => setPricePerMonth(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Deposit Amount (USD)</label>
              <input
                type="number"
                value={depositRequired}
                onChange={(e) => setDepositRequired(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block font-bold text-slate-700">Zero-Scam Deposit Guarantee Policy</label>
              <input
                type="text"
                value={depositPolicy}
                onChange={(e) => setDepositPolicy(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium text-slate-800"
                required
              />
              <p className="text-[11px] text-slate-500">
                To build trust, StayVerify policies strictly forbid demanding money before a physical inspection.
              </p>
            </div>
          </div>

          {/* Timestamped Photo Upload (FR-08) */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-slate-900">Original Timestamped Walkthrough Photo / Video (FR-08)</h3>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Anti-Stock-Image Guard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Image URL / Walkthrough Link</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Photo Caption / Room Type</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={verifyTimestampExif}
                onChange={(e) => setVerifyTimestampExif(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">
                Include Camera EXIF Timestamp & Geolocation Verification (Protects against unverified/stolen photos)
              </span>
            </label>
          </div>

          {/* Infrastructure Amenities Checklist */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <span className="block font-bold text-xs text-slate-900">Included Student Infrastructure Amenities:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {[
                'Solar Power (24/7)',
                'Borehole Water',
                'Fiber Wi-Fi',
                'Electric Fence & Guard',
                'Study Desks',
                'Gas Stove Backup',
                'Washing Machine',
                'Fitted Wardrobes'
              ].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-800">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('my_listings')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Verified Listing (UC-02)</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Proof Documents & Badge Upgrades (FR-02) */}
      {activeTab === 'verification_docs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                  <span>Submit Proof-of-Ownership for Admin Verification (FR-02)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Upload official documentation to earn the "Document Verified" or "Physically Verified" trust badge.
                </p>
              </div>
            </div>

            {docSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Document successfully queued for manual review by Platform Admin (FR-03).</span>
              </div>
            )}

            <form onSubmit={handleUploadDocument} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value="title_deed">Property Title Deed (Deeds Registry)</option>
                  <option value="council_rates">City Council Rates Bill (Bulawayo Council)</option>
                  <option value="utility_bill">ZETDC Electricity / Utility Bill</option>
                  <option value="agency_mandate">Registered Letting Agency Mandate Letter</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Document / Folio Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. DEED-BYO-2024-883"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">File Attachment (PDF / JPG)</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload for Admin Audit</span>
                </button>
              </div>
            </form>
          </div>

          {/* Submissions History */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Your Document Submissions</h3>
            {myDocuments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {myDocuments.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900 capitalize">{doc.documentType.replace('_', ' ')}</span>
                        <span className="font-mono text-[11px] text-slate-500">({doc.fileName})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Uploaded: {new Date(doc.uploadDate).toLocaleDateString()} &bull; Ref: {doc.documentNumber || 'N/A'}
                      </p>
                      {doc.adminReviewNotes && (
                        <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded">
                          Admin Note: {doc.adminReviewNotes}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        doc.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No documents submitted yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
