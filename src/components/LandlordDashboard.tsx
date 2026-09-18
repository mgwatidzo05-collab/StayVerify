import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { MapLocationVerifier } from './MapLocationVerifier';
import {
  Building2,
  PlusCircle,
  Key,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  LogOut,
  MapPin,
  DollarSign,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Pencil,
  Phone,
  MessageCircle,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  ExternalLink
} from 'lucide-react';

const SAMPLE_ROOM_IMAGES = [
  { label: 'Study Bedroom', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80' },
  { label: 'Twin Sharing Room', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Private Cottage', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cozy Single Room', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80' }
];

export const LandlordDashboard: React.FC = () => {
  const {
    landlordUser,
    loginLandlordWithKey,
    logoutLandlord,
    allUsers,
    listings,
    addListing,
    updateListing,
    deleteListing,
    setSelectedListing
  } = useApp();

  // Access key login state
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);

  // Landlord view tab
  const [activeTab, setActiveTab] = useState<'my_listings' | 'add_accommodation' | 'edit_accommodation'>('my_listings');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Form states for adding/editing accommodation
  const [title, setTitle] = useState('');
  const [suburb, setSuburb] = useState('Selborne Park');
  const [address, setAddress] = useState('');
  const [pricePerMonth, setPricePerMonth] = useState<number>(110);
  const [depositRequired, setDepositRequired] = useState<number>(50);
  const [roomType, setRoomType] = useState<Listing['roomType']>('two_sharing');
  const [totalRooms, setTotalRooms] = useState<number>(4);
  const [availableSpots, setAvailableSpots] = useState<number>(2);
  const [distanceKm, setDistanceKm] = useState<number>(1.2);
  const [contactPhone, setContactPhone] = useState(landlordUser?.phone || '+263 77 123 4567');
  const [googleMapUrl, setGoogleMapUrl] = useState('');
  const [isMapVerified, setIsMapVerified] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);
  // Multiple room pictures state (Upload from gallery or URL)
  const [photos, setPhotos] = useState<string[]>([SAMPLE_ROOM_IMAGES[0].url]);
  const [urlInput, setUrlInput] = useState('');
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Solar Power (24/7)',
    'Borehole Water',
    'Fiber Wi-Fi'
  ]);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError(null);
    if (!accessKeyInput.trim()) {
      setKeyError('Please enter your Landlord Access Key.');
      return;
    }

    const res = loginLandlordWithKey(accessKeyInput);
    if (!res.success) {
      setKeyError(res.error || 'Invalid Landlord Access Key. Please contact the Admin on WhatsApp (0712016200) if you require a key.');
    } else {
      setAccessKeyInput('');
    }
  };

  // Gallery image upload handling (supports multiple images)
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const readers = fileList.map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then(base64Images => {
        setPhotos(prev => [...prev, ...base64Images]);
      })
      .catch(err => {
        console.error('Error reading gallery files', err);
        setFormError('Failed to load selected images from device gallery.');
      });

    e.target.value = '';
  };

  const handleAddPhotoByUrl = () => {
    if (!urlInput.trim()) return;
    setPhotos(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos(prev => [...prev, url]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prev => {
      const remaining = prev.filter((_, idx) => idx !== indexToRemove);
      return remaining.length > 0 ? remaining : [SAMPLE_ROOM_IMAGES[0].url];
    });
  };

  const handleSetMainPhoto = (indexToPromote: number) => {
    setPhotos(prev => {
      if (indexToPromote === 0) return prev;
      const target = prev[indexToPromote];
      const others = prev.filter((_, idx) => idx !== indexToPromote);
      return [target, ...others];
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleStartEdit = (listing: Listing) => {
    setEditingListing(listing);
    setTitle(listing.title);
    setSuburb(listing.suburb);
    setAddress(listing.address);
    setPricePerMonth(listing.pricePerMonthUsd);
    setDepositRequired(listing.depositRequiredUsd || 0);
    setRoomType(listing.roomType);
    setTotalRooms(listing.totalRooms || 4);
    setAvailableSpots(listing.availableSpots);
    setDistanceKm(listing.distanceToCampusKm);
    setContactPhone(listing.landlordPhone || landlordUser?.phone || '+263 77 123 4567');
    setGoogleMapUrl(listing.googleMapUrl || '');
    setIsMapVerified(!!listing.isMapVerified || !!listing.googleMapUrl);
    setCoordinates(listing.coordinates);
    
    // Extract all photos from existing media and photos
    const initialPhotos: string[] = [];
    if (listing.media && listing.media.length > 0) {
      listing.media.forEach(m => {
        if (m.url && !initialPhotos.includes(m.url)) initialPhotos.push(m.url);
      });
    }
    if ((listing as any).photos && (listing as any).photos.length > 0) {
      (listing as any).photos.forEach((p: any) => {
        if (p.url && !initialPhotos.includes(p.url)) initialPhotos.push(p.url);
      });
    }
    if (initialPhotos.length === 0) {
      initialPhotos.push(SAMPLE_ROOM_IMAGES[0].url);
    }
    setPhotos(initialPhotos);
    setUrlInput('');
    setSelectedAmenities(listing.amenities || []);
    setFormError(null);
    setFormSuccess(null);
    setActiveTab('edit_accommodation');
  };

  const handleCancelEdit = () => {
    setEditingListing(null);
    setGoogleMapUrl('');
    setFormError(null);
    setFormSuccess(null);
    setActiveTab('my_listings');
  };

  const handleUpdateAccommodation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!landlordUser || !editingListing) return;

    if (!title.trim() || !address.trim()) {
      setFormError('Please enter both the title and physical street address.');
      return;
    }

    const phoneToSave = contactPhone.trim() || landlordUser.phone || '+263 77 123 4567';
    const activePhotos = photos.length > 0 ? photos : [SAMPLE_ROOM_IMAGES[0].url];

    const result = updateListing(editingListing.id, {
      title: title.trim(),
      suburb,
      address: address.trim(),
      googleMapUrl: googleMapUrl.trim() || undefined,
      isMapVerified: isMapVerified || !!googleMapUrl.trim(),
      coordinates,
      distanceToCampusKm: Number(distanceKm),
      walkingMinutes: Math.round(Number(distanceKm) * 12),
      pricePerMonthUsd: Number(pricePerMonth),
      depositRequiredUsd: Number(depositRequired),
      roomType,
      totalRooms: Number(totalRooms),
      availableSpots: Number(availableSpots),
      landlordPhone: phoneToSave,
      amenities: selectedAmenities,
      photos: activePhotos.map((url, idx) => ({
        id: `p-${Date.now()}-${idx}`,
        url,
        caption: idx === 0 ? 'Main student room photo' : `Room view ${idx + 1}`,
        isVerifiedByAdmin: true,
        uploadDate: new Date().toISOString()
      })),
      media: activePhotos.map((url, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        url,
        caption: idx === 0 ? 'Main student room photo' : `Room view ${idx + 1}`,
        isWalkthroughVideo: false,
        timestamp: new Date().toISOString(),
        cameraMetadataVerified: true,
        isOriginalChecked: true
      }))
    });

    if (result.success) {
      setFormSuccess('Accommodation details updated successfully!');
      setTimeout(() => {
        setEditingListing(null);
        setGoogleMapUrl('');
        setActiveTab('my_listings');
        setFormSuccess(null);
      }, 1000);
    } else {
      setFormError(result.error || 'Failed to update accommodation.');
    }
  };

  const handleAddAccommodation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!landlordUser) return;

    if (!title.trim() || !address.trim()) {
      setFormError('Please enter both the title and physical street address.');
      return;
    }

    const phoneToSave = contactPhone.trim() || landlordUser.phone || '+263 77 123 4567';
    const activePhotos = photos.length > 0 ? photos : [SAMPLE_ROOM_IMAGES[0].url];

    const result = addListing({
      landlordId: landlordUser.id,
      landlordName: landlordUser.name,
      landlordEmail: landlordUser.email,
      landlordPhone: phoneToSave,
      landlordTier: 'document_verified',
      title: title.trim(),
      description: `Verified student accommodation located in ${suburb}. Clean, quiet, and secure environment near campus.`,
      address: address.trim(),
      googleMapUrl: googleMapUrl.trim() || undefined,
      isMapVerified: isMapVerified || !!googleMapUrl.trim(),
      coordinates,
      suburb,
      distanceToCampusKm: Number(distanceKm),
      walkingMinutes: Math.round(Number(distanceKm) * 12),
      pricePerMonthUsd: Number(pricePerMonth),
      depositRequiredUsd: Number(depositRequired),
      depositPolicy: 'Deposit payable only after in-person inspection and agreement signing.',
      roomType,
      totalRooms: Number(totalRooms),
      availableSpots: Number(availableSpots),
      genderPreference: 'any',
      amenities: selectedAmenities,
      photos: activePhotos.map((url, idx) => ({
        id: `p-${Date.now()}-${idx}`,
        url,
        caption: idx === 0 ? 'Main student room photo' : `Room view ${idx + 1}`,
        isVerifiedByAdmin: true,
        uploadDate: new Date().toISOString()
      })),
      media: activePhotos.map((url, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        url,
        caption: idx === 0 ? 'Main student room photo' : `Room view ${idx + 1}`,
        isWalkthroughVideo: false,
        timestamp: new Date().toISOString(),
        cameraMetadataVerified: true,
        isOriginalChecked: true
      })),
      verificationBadge: 'document_verified',
      verificationDate: new Date().toISOString(),
      status: 'active'
    });

    if (result.success) {
      setFormSuccess('Accommodation successfully published! Students can now view it, check its Google Map location, and contact you on WhatsApp.');
      setTitle('');
      setAddress('');
      setGoogleMapUrl('');
      setTimeout(() => {
        setActiveTab('my_listings');
        setFormSuccess(null);
      }, 1200);
    } else {
      setFormError(result.error || 'Failed to publish accommodation.');
    }
  };

  // If landlord is not logged in with an access key
  if (!landlordUser) {
    return (
      <div className="max-w-xl mx-auto my-8 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Landlord Portal Access</h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
              Enter the unique Landlord Access Key provided to you by the Admin to add and manage your accommodations.
            </p>
          </div>

          <div className="p-6">
            {keyError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{keyError}</span>
              </div>
            )}

            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Enter Landlord Access Key
                  </label>
                  <span className="text-[11px] text-slate-400">Issued by Admin</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={accessKeyInput}
                    onChange={(e) => setAccessKeyInput(e.target.value)}
                    placeholder="e.g. HOST-SIBANDA-77"
                    className="w-full text-xs font-mono tracking-wider px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 rounded-lg transition"
                  >
                    Unlock
                  </button>
                </div>

                {/* Quick test chips */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-medium">Quick Test Keys:</span>
                  <button
                    type="button"
                    onClick={() => setAccessKeyInput('HOST-SIBANDA-77')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200 transition"
                  >
                    HOST-SIBANDA-77
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccessKeyInput('HOST-KHUMALO-88')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200 transition"
                  >
                    HOST-KHUMALO-88
                  </button>
                </div>
              </div>

              {/* Instructions to contact admin */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Require an Access Key?</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If you are a landlord and require a Landlord Access Key to list or manage student accommodation, please contact the Admin on WhatsApp:
                  </p>

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <a
                      href="https://wa.me/263712016200?text=Hello%20Admin,%20I%20am%20a%20landlord%20and%20I%20require%20an%20Access%20Key%20to%20list%20my%20accommodation."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs w-fit"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact Admin on WhatsApp (0712016200)</span>
                    </a>

                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-white px-3 py-1.5 rounded-lg border border-emerald-200/80">
                      <span className="text-slate-500">WhatsApp:</span>
                      <span className="font-mono font-bold text-emerald-800">0712016200</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Once Landlord is unlocked
  const myListings = listings.filter(l => l.landlordId === landlordUser.id);

  return (
    <div className="space-y-6">
      {/* Landlord Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-base">
            {landlordUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{landlordUser.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Landlord
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Access Key: <span className="font-bold text-slate-800">{landlordUser.accessKey || 'AUTHENTICATED'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('add_accommodation')}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition ${
              activeTab === 'add_accommodation'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Accommodation</span>
          </button>

          <button
            onClick={logoutLandlord}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-2 rounded-xl transition border border-slate-200"
            title="Log out of Landlord Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Portal</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('my_listings'); setEditingListing(null); }}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
            activeTab === 'my_listings'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Accommodations ({myListings.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('add_accommodation');
            setEditingListing(null);
            setTitle('');
            setAddress('');
            setPricePerMonth(110);
            setDepositRequired(50);
            setRoomType('two_sharing');
            setContactPhone(landlordUser?.phone || '+263 77 123 4567');
          }}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
            activeTab === 'add_accommodation'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          + Add New Accommodation
        </button>
        {activeTab === 'edit_accommodation' && (
          <button
            onClick={() => setActiveTab('edit_accommodation')}
            className="pb-3 px-4 text-xs font-bold border-b-2 border-emerald-600 text-emerald-600 flex items-center gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Accommodation</span>
          </button>
        )}
      </div>

      {/* Tab 1: My Accommodations */}
      {activeTab === 'my_listings' && (
        <div className="space-y-4">
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col"
                >
                  <div className="relative h-44 bg-slate-100">
                    <img
                      src={listing.media?.[0]?.url || (listing as any).photos?.[0]?.url || SAMPLE_ROOM_IMAGES[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2 py-1 rounded-lg">
                      ${listing.pricePerMonthUsd}/month
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{listing.suburb} · {listing.distanceToCampusKm} km to NUST</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{listing.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{listing.address}</p>

                      {/* Google Maps Location info */}
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>Google Map:</span>
                        </span>
                        <a
                          href={listing.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address + ', ' + listing.suburb + ', Bulawayo')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-0.5 rounded transition"
                        >
                          <span>{listing.googleMapUrl ? 'Location Configured' : 'View on Maps'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Configured WhatsApp for Students */}
                      <div className="mt-2.5 p-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-600">WhatsApp:</span>
                          <span className="text-[11px] font-mono font-bold text-emerald-800">
                            {listing.landlordPhone || landlordUser.phone || '+263 77 123 4567'}
                          </span>
                        </div>
                        <span className="text-[9px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Active</span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleStartEdit(listing)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition"
                        title="Edit Accommodation Details"
                      >
                        <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Edit</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 px-2 py-1.5 rounded-lg hover:bg-emerald-50 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove accommodation "${listing.title}"?`)) {
                              deleteListing(listing.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                          title="Remove Accommodation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">You haven't added any accommodation yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your available rooms or cottages so NUST students can find and contact you safely.
              </p>
              <button
                onClick={() => setActiveTab('add_accommodation')}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Your First Accommodation</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Add Accommodation Form */}
      {activeTab === 'add_accommodation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl">
          <div className="mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900">Post New Student Accommodation</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in your room details. It will immediately be visible to all logged-in students.
            </p>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddAccommodation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Accommodation Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spacious Student Room with Solar & Borehole"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Suburb *
                </label>
                <select
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Selborne Park">Selborne Park</option>
                  <option value="Riverside">Riverside</option>
                  <option value="Matsheumhlope">Matsheumhlope</option>
                  <option value="Kumalo">Kumalo</option>
                  <option value="Bradfield">Bradfield</option>
                  <option value="Sunnyside">Sunnyside</option>
                  <option value="Killarney">Killarney</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distance to NUST Campus (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="15"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Physical Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Acacia Avenue, Selborne Park, Bulawayo"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Map Location & Address Verification */}
            <MapLocationVerifier
              initialUrl={googleMapUrl}
              initialAddress={address}
              initialSuburb={suburb}
              onLocationVerified={({ googleMapUrl: newUrl, distanceKm: newDist, coordinates: newCoords, isMapVerified: verified }) => {
                setGoogleMapUrl(newUrl);
                setDistanceKm(newDist);
                setIsMapVerified(verified);
                if (newCoords) setCoordinates(newCoords);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Rent ($ USD) *
                </label>
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={pricePerMonth}
                  onChange={(e) => setPricePerMonth(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security Deposit ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={depositRequired}
                  onChange={(e) => setDepositRequired(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as Listing['roomType'])}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="single">Single Room</option>
                  <option value="two_sharing">2-Sharing Room</option>
                  <option value="three_sharing">3-Sharing Room</option>
                  <option value="cottage">Full Cottage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Available Vacancies / Spots *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={availableSpots}
                  onChange={(e) => setAvailableSpots(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landlord WhatsApp Phone Number *
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +263 77 123 4567"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Multiple Room Pictures Management */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <label className="text-xs font-bold text-slate-800">
                      Room Pictures & Gallery (Multiple Photos Supported) *
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload photos directly from your phone or device gallery, or paste image URLs.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full w-fit">
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'} added
                </span>
              </div>

              {/* Upload Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={addFileInputRef}
                  onChange={handleGalleryUpload}
                  className="hidden"
                  id="add-room-gallery-input"
                />
                <button
                  type="button"
                  onClick={() => addFileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Add Pictures from Gallery</span>
                </button>

                <div className="flex-1 min-w-[240px] flex items-center gap-1.5">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPhotoByUrl();
                      }
                    }}
                    placeholder="Or paste an image URL here..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoByUrl}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Sample Presets Quick Add */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Or quickly add sample room presets:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_ROOM_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSamplePhoto(img.url)}
                      className={`relative rounded-xl overflow-hidden border transition text-left h-16 group cursor-pointer ${
                        photos.includes(img.url) ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      title="Click to add this photo to your accommodation"
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-end p-1">
                        <span className="text-white text-[9px] font-bold truncate">
                          + {img.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Photos Gallery Grid */}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Current Room Photos ({photos.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs group aspect-4/3"
                    >
                      <img
                        src={photo}
                        alt={`Room photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Main / Cover Badge */}
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Cover Photo
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetMainPhoto(idx)}
                          className="absolute top-1.5 left-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition shadow-xs cursor-pointer"
                          title="Set as main cover photo"
                        >
                          Set as Cover
                        </button>
                      )}

                      {/* Delete / Remove Photo button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition shadow-xs cursor-pointer"
                        title="Remove this photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Photo Index Tag */}
                      <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  'Solar Power (24/7)',
                  'Borehole Water',
                  'Fiber Wi-Fi',
                  'Study Desk & Chair',
                  'Secure Perimeter Wall',
                  'Gas Stove Backup',
                  'Caretaker On-site'
                ].map((amenity) => (
                  <label
                    key={amenity}
                    className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      selectedAmenities.includes(amenity)
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px]">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Post Accommodation to Student Directory</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Edit Accommodation Form */}
      {activeTab === 'edit_accommodation' && editingListing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Edit Accommodation Mode
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {editingListing.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Update room features, pricing, available spots, and your WhatsApp contact number for students.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Cancel editing"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateAccommodation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Accommodation Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spacious Student Room with Solar & Borehole"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Suburb *
                </label>
                <select
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Selborne Park">Selborne Park</option>
                  <option value="Riverside">Riverside</option>
                  <option value="Matsheumhlope">Matsheumhlope</option>
                  <option value="Kumalo">Kumalo</option>
                  <option value="Bradfield">Bradfield</option>
                  <option value="Sunnyside">Sunnyside</option>
                  <option value="Killarney">Killarney</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distance to NUST Campus (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="15"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Physical Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Acacia Avenue, Selborne Park, Bulawayo"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Map Location & Address Verification */}
            <MapLocationVerifier
              initialUrl={googleMapUrl}
              initialAddress={address}
              initialSuburb={suburb}
              onLocationVerified={({ googleMapUrl: newUrl, distanceKm: newDist, coordinates: newCoords, isMapVerified: verified }) => {
                setGoogleMapUrl(newUrl);
                setDistanceKm(newDist);
                setIsMapVerified(verified);
                if (newCoords) setCoordinates(newCoords);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Rent ($ USD) *
                </label>
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={pricePerMonth}
                  onChange={(e) => setPricePerMonth(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security Deposit ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={depositRequired}
                  onChange={(e) => setDepositRequired(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as Listing['roomType'])}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="single">Single Room</option>
                  <option value="two_sharing">2-Sharing Room</option>
                  <option value="three_sharing">3-Sharing Room</option>
                  <option value="cottage">Full Cottage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Available Vacancies / Spots *
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={availableSpots}
                  onChange={(e) => setAvailableSpots(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landlord WhatsApp Phone Number *
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +263 77 123 4567"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Students click "Connect on WhatsApp" to message this specific number.
                </p>
              </div>
            </div>

            {/* Multiple Room Pictures Management (Edit Mode) */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <label className="text-xs font-bold text-slate-800">
                      Room Pictures & Gallery (Multiple Photos Supported) *
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Add or update pictures of your rooms from your device gallery or image URLs.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full w-fit">
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'} attached
                </span>
              </div>

              {/* Upload Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={editFileInputRef}
                  onChange={handleGalleryUpload}
                  className="hidden"
                  id="edit-room-gallery-input"
                />
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Add Pictures from Gallery</span>
                </button>

                <div className="flex-1 min-w-[240px] flex items-center gap-1.5">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPhotoByUrl();
                      }
                    }}
                    placeholder="Or paste an image URL here..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoByUrl}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Sample Presets Quick Add */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Or quickly add sample room presets:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_ROOM_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSamplePhoto(img.url)}
                      className={`relative rounded-xl overflow-hidden border transition text-left h-16 group cursor-pointer ${
                        photos.includes(img.url) ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      title="Click to add this photo to your accommodation"
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-end p-1">
                        <span className="text-white text-[9px] font-bold truncate">
                          + {img.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Photos Gallery Grid */}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Current Room Photos ({photos.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs group aspect-4/3"
                    >
                      <img
                        src={photo}
                        alt={`Room photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Main / Cover Badge */}
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Cover Photo
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetMainPhoto(idx)}
                          className="absolute top-1.5 left-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition shadow-xs cursor-pointer"
                          title="Set as main cover photo"
                        >
                          Set as Cover
                        </button>
                      )}

                      {/* Delete / Remove Photo button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition shadow-xs cursor-pointer"
                        title="Remove this photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Photo Index Tag */}
                      <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  'Solar Power (24/7)',
                  'Borehole Water',
                  'Fiber Wi-Fi',
                  'Study Desk & Chair',
                  'Secure Perimeter Wall',
                  'Gas Stove Backup',
                  'Caretaker On-site'
                ].map((amenity) => (
                  <label
                    key={amenity}
                    className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      selectedAmenities.includes(amenity)
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px]">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Accommodation Changes</span>
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
