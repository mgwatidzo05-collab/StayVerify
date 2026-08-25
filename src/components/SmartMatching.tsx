import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, RoommateProfile } from '../types';
import { VerificationBadge } from './VerificationBadge';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Sun,
  Droplets,
  Wifi,
  ShieldCheck,
  MessageSquare,
  Eye,
  Search,
  BookOpen,
  Coffee,
  Moon
} from 'lucide-react';

export const SmartMatching: React.FC<{ onOpenListing: (listing: Listing) => void }> = ({ onOpenListing }) => {
  const {
    listings,
    studentPreferences,
    updateStudentPreferences,
    roommates,
    currentUser,
    startOrOpenConversation,
    addRoommateProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings_match' | 'roommate_match'>('listings_match');
  const [showRoommatePostModal, setShowRoommatePostModal] = useState(false);
  const [newRoommateName, setNewRoommateName] = useState(currentUser.name);
  const [newProgram, setNewProgram] = useState('BSc Computer Science (Year 2)');
  const [newBudget, setNewBudget] = useState(80);
  const [newStudyHabit, setNewStudyHabit] = useState('Night owl, quiet study in room');
  const [newCleanliness, setNewCleanliness] = useState('High cleanliness standard');
  const [newBio, setNewBio] = useState('Looking for a serious study-focused roommate in Riverside or Selborne Park with reliable solar power.');

  // Calculate Match Score for each listing based on student preferences (FR-10)
  const calculateListingMatchScore = (listing: Listing) => {
    let score = 0;
    let maxScore = 100;

    // Budget match (35 pts)
    if (listing.pricePerMonthUsd <= studentPreferences.maxBudgetUsd) {
      if (listing.pricePerMonthUsd >= studentPreferences.minBudgetUsd) {
        score += 35;
      } else {
        score += 30;
      }
    } else {
      const overBudgetPercent = (listing.pricePerMonthUsd - studentPreferences.maxBudgetUsd) / studentPreferences.maxBudgetUsd;
      score += Math.max(0, 35 - overBudgetPercent * 50);
    }

    // Distance match (25 pts)
    if (listing.distanceToCampusKm <= studentPreferences.maxDistanceKm) {
      score += 25;
    } else {
      const extraKm = listing.distanceToCampusKm - studentPreferences.maxDistanceKm;
      score += Math.max(0, 25 - extraKm * 10);
    }

    // Suburb match (15 pts)
    if (studentPreferences.suburbs.includes(listing.suburb)) {
      score += 15;
    }

    // Required amenities match (25 pts)
    const matchedAmenities = studentPreferences.requiredAmenities.filter(req =>
      listing.amenities.some(a => a.toLowerCase().includes(req.toLowerCase()))
    );
    const amenityRatio = studentPreferences.requiredAmenities.length > 0
      ? matchedAmenities.length / studentPreferences.requiredAmenities.length
      : 1;
    score += amenityRatio * 25;

    // Bonus for Physically Verified (5 pts)
    if (listing.verificationBadge === 'physically_verified') score += 5;

    return Math.min(100, Math.round(score));
  };

  const rankedListings = listings
    .filter(l => l.status === 'active')
    .map(listing => ({
      listing,
      matchScore: calculateListingMatchScore(listing)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const handlePostRoommate = (e: React.FormEvent) => {
    e.preventDefault();
    addRoommateProfile({
      studentId: currentUser.id,
      name: newRoommateName,
      program: newProgram,
      institution: currentUser.institution || 'NUST',
      budgetPerPersonUsd: newBudget,
      preferredSuburbs: ['Riverside', 'Selborne Park'],
      studyHabits: newStudyHabit,
      cleanliness: newCleanliness,
      bio: newBio,
      lookingForGender: 'any',
      verifiedStudent: true
    });
    setShowRoommatePostModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Intelligent Allocation Engine (FR-10 & FR-11)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Personalized Accommodation & Co-Tenant Matching
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Find verified student housing ranked dynamically by your budget, commute distance, and study lifestyle, or pair up with compatible NUST student roommates.
            </p>
          </div>

          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-700/80 self-start md:self-center shrink-0">
            <button
              id="match-tab-listings"
              onClick={() => setActiveTab('listings_match')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'listings_match' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Accommodation Matches
            </button>
            <button
              id="match-tab-roommates"
              onClick={() => setActiveTab('roommates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'roommates' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Roommate Compatibility (FR-11)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'listings_match' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preferences Control Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>My Allocation Criteria</span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold">
                Auto-Updating
              </span>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Maximum Monthly Budget</span>
                <span className="text-blue-600">${studentPreferences.maxBudgetUsd} USD</span>
              </div>
              <input
                type="range"
                min={50}
                max={250}
                step={5}
                value={studentPreferences.maxBudgetUsd}
                onChange={(e) => updateStudentPreferences({ maxBudgetUsd: Number(e.target.value) })}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Max Distance to Campus */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Max Walk / Commute Distance</span>
                <span className="text-blue-600">{studentPreferences.maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={4.0}
                step={0.1}
                value={studentPreferences.maxDistanceKm}
                onChange={(e) => updateStudentPreferences({ maxDistanceKm: Number(e.target.value) })}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Study Habit Preference */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">Study Style & Environment</label>
              <select
                value={studentPreferences.studyHabit}
                onChange={(e) => updateStudentPreferences({ studyHabit: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
              >
                <option value="quiet_night_owl">Quiet Night Owl (Late night revision)</option>
                <option value="early_bird">Early Bird (Morning study 5am - 10pm)</option>
                <option value="group_study">Group Study / Collaborative</option>
                <option value="moderate">Moderate / Standard Study Hours</option>
              </select>
            </div>

            {/* Cleanliness Standard */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">Cleanliness Standard</label>
              <select
                value={studentPreferences.cleanlinessStandard}
                onChange={(e) => updateStudentPreferences({ cleanlinessStandard: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
              >
                <option value="very_strict">Very Strict (Daily cleaning rota)</option>
                <option value="moderate">Moderate (Standard student shared)</option>
                <option value="relaxed">Relaxed / Flexible</option>
              </select>
            </div>

            {/* Required Infrastructure Amenities */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-800">Required Infrastructure:</span>
              <div className="space-y-1.5">
                {['Solar Power (24/7)', 'Borehole Water', 'Fiber Wi-Fi', 'Electric Fence & Guard'].map((amenity) => {
                  const checked = studentPreferences.requiredAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...studentPreferences.requiredAmenities, amenity]
                            : studentPreferences.requiredAmenities.filter(a => a !== amenity);
                          updateStudentPreferences({ requiredAmenities: next });
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ranked Results List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Ranked Recommendations</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                  {rankedListings.length} Options
                </span>
              </h2>
              <span className="text-xs text-slate-500">Sorted by preference compatibility score</span>
            </div>

            {rankedListings.map(({ listing, matchScore }) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-300 transition flex flex-col sm:flex-row gap-4 justify-between"
              >
                <div className="flex gap-3 sm:gap-4 flex-1">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                    {listing.media && listing.media[0] ? (
                      <img src={listing.media[0].url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : null}
                  </div>

                  {/* Details */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <VerificationBadge tier={listing.verificationBadge} size="sm" />
                      <span className="text-xs font-bold text-slate-500">{listing.suburb}</span>
                    </div>

                    <h3
                      onClick={() => onOpenListing(listing)}
                      className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer line-clamp-1"
                    >
                      {listing.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">${listing.pricePerMonthUsd} USD/mo</span>
                      <span>•</span>
                      <span>{listing.distanceToCampusKm} km to NUST ({listing.walkingMinutes} min)</span>
                    </div>

                    {/* Key amenities badge */}
                    <div className="flex flex-wrap gap-1 pt-1 text-[10px] text-slate-600">
                      {listing.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match Score & Actions */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4 shrink-0 gap-2">
                  <div className="text-center">
                    <div className={`text-xl font-extrabold ${matchScore >= 80 ? 'text-emerald-600' : matchScore >= 60 ? 'text-blue-600' : 'text-slate-600'}`}>
                      {matchScore}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Match Score</span>
                  </div>

                  <div className="flex sm:flex-col gap-1.5 w-full">
                    <button
                      onClick={() => onOpenListing(listing)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => startOrOpenConversation(listing.id, listing.landlordId, listing.landlordName, listing.title)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg font-medium border border-blue-200 transition"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Roommate Matching Board (FR-11) */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">NUST Verified Student Roommate Board</h2>
              <p className="text-xs text-slate-500">Connect with fellow students to split rent on verified 2-sharing and 4-sharing properties.</p>
            </div>
            <button
              id="post-roommate-profile-btn"
              onClick={() => setShowRoommatePostModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Post Roommate Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roommates.map((rm) => (
              <div key={rm.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                        {rm.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{rm.name}</p>
                        <p className="text-[11px] text-blue-600 font-medium">{rm.program}</p>
                      </div>
                    </div>
                    {rm.verifiedStudent && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Student
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Budget Share:</span>
                      <span className="font-bold text-slate-900">${rm.budgetPerPersonUsd} USD / person</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Target Areas:</span>
                      <span className="font-semibold text-slate-800">{rm.preferredSuburbs.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Study Habits:</span>
                      <span className="text-slate-700">{rm.studyHabits}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic">"{rm.bio}"</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      alert(`Safety Alert: In-platform roommate message channel opened with ${rm.name}.`);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Connect & Form Pair</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Post Profile */}
          {showRoommatePostModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <h3 className="font-bold text-base text-slate-900">Post Your Roommate Profile (FR-11)</h3>
                <form onSubmit={handlePostRoommate} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Your Full Name & Program</label>
                    <input
                      type="text"
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                      placeholder="e.g. BSc Applied Physics (Year 3)"
                      className="w-full p-2 border border-slate-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Your Max Target Budget (USD/mo)</label>
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Study Habits & Daily Routine</label>
                    <input
                      type="text"
                      value={newStudyHabit}
                      onChange={(e) => setNewStudyHabit(e.target.value)}
                      placeholder="e.g. Early riser, focused quiet revision, no loud music"
                      className="w-full p-2 border border-slate-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Brief Description / Requirements</label>
                    <textarea
                      rows={3}
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      placeholder="What kind of co-tenant are you looking for? (e.g. non-smoker, quiet, hygienic)"
                      className="w-full p-2 border border-slate-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRoommatePostModal(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold shadow-xs"
                    >
                      Publish Roommate Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
