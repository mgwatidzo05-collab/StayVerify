import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScamReportReason, Listing } from '../types';
import {
  AlertOctagon,
  X,
  ShieldAlert,
  FileText,
  MessageSquare,
  DollarSign,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ReportScamModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    reportTargetListing,
    setReportTargetListing,
    currentUser,
    submitScamReport,
    listings,
    conversations,
    messages
  } = useApp();

  const [selectedReason, setSelectedReason] = useState<ScamReportReason>('advance_deposit_before_viewing');
  const [description, setDescription] = useState('');
  const [amountDemanded, setAmountDemanded] = useState<string>('50');
  const [targetListingId, setTargetListingId] = useState<string>(reportTargetListing?.id || (listings[0]?.id ?? ''));
  const [submittedCase, setSubmittedCase] = useState<{ caseNumber: string; autoSuspended: boolean } | null>(null);

  if (!isReportModalOpen) return null;

  const currentTargetListing = reportTargetListing || listings.find(l => l.id === targetListingId);

  const REASONS: { value: ScamReportReason; label: string; description: string }[] = [
    {
      value: 'advance_deposit_before_viewing',
      label: 'Demanded Advance Deposit / Booking Fee Before Physical Viewing (High-Risk)',
      description: 'Landlord requested EcoCash/money transfer to "reserve" keys or view the property.'
    },
    {
      value: 'fake_photos_or_stolen_listing',
      label: 'Stolen or Fake Stock Photos (Doesn\'t match reality)',
      description: 'Photos found on other websites or property does not look like the images.'
    },
    {
      value: 'impersonating_owner',
      label: 'Impersonation of True Property Owner / Fake Agent',
      description: 'User claiming to be the landlord without legitimate agency mandate or deed.'
    },
    {
      value: 'room_not_available_or_already_rented',
      label: 'Ghost Listing / Room Already Occupied by Others',
      description: 'Multiple students sent deposits for the exact same occupied room.'
    },
    {
      value: 'unreachable_after_payment_demand',
      label: 'Unreachable / Blocked Communications',
      description: 'Landlord became unresponsive or hostile after inquiry or payment.'
    },
    {
      value: 'threats_or_harassment',
      label: 'Harassment, Intimidation or Threatening Behavior',
      description: 'Unsafe or aggressive interactions within or outside the platform.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const chosenReasonObj = REASONS.find(r => r.value === selectedReason);

    const report = submitScamReport({
      targetListingId: currentTargetListing?.id,
      targetListingTitle: currentTargetListing?.title,
      targetUserId: currentTargetListing?.landlordId || 'usr-unknown',
      targetUserName: currentTargetListing?.landlordName || 'Unknown Landlord',
      reason: selectedReason,
      reasonLabel: chosenReasonObj?.label || selectedReason,
      description,
      amountDemandedUsd: amountDemanded ? Number(amountDemanded) : undefined
    });

    setSubmittedCase({
      caseNumber: report.caseNumber,
      autoSuspended: !!report.isThresholdAutoSuspension
    });
  };

  const handleClose = () => {
    setIsReportModalOpen(false);
    setReportTargetListing(null);
    setSubmittedCase(null);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        id="scam-report-modal"
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedCase ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Scam Incident Report Logged</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your report has been assigned Case Reference <span className="font-mono font-bold text-blue-600">{submittedCase.caseNumber}</span> and escalated to the StayVerify Campus Safety Review Queue (FR-17).
            </p>

            {submittedCase.autoSuspended ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 max-w-md mx-auto text-xs text-red-900 space-y-1">
                <div className="font-bold flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Automatic Listing Suspension Activated (FR-18)</span>
                </div>
                <p className="text-[11px] text-red-800">
                  Because this property accumulated multiple fraud flags, StayVerify has immediately locked the listing to protect other students pending administrative investigation.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 max-w-md mx-auto text-xs text-blue-800">
                In-platform chat logs and listing snapshots were automatically archived as tamper-evident evidence (FR-14).
              </div>
            )}

            <button
              onClick={handleClose}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2 rounded-lg transition shadow-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700">
              <div className="p-2 bg-rose-100 rounded-lg">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Report Scam or Suspicious Listing (FR-16)</h3>
                <p className="text-xs text-slate-500">All submissions are reviewed promptly by the Platform Admin.</p>
              </div>
            </div>

            {/* Target Listing Indicator */}
            {currentTargetListing && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-medium">Target Property:</span>
                  <p className="font-bold text-slate-800">{currentTargetListing.title}</p>
                  <p className="text-[11px] text-slate-500">Host: {currentTargetListing.landlordName} ({currentTargetListing.suburb})</p>
                </div>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                  ID: {currentTargetListing.id}
                </span>
              </div>
            )}

            {/* Select Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Violation or Scam Type:</label>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`block p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      selectedReason === r.value
                        ? 'border-rose-500 bg-rose-50/60 font-semibold text-rose-950 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="reportReason"
                        value={r.value}
                        checked={selectedReason === r.value}
                        onChange={() => setSelectedReason(r.value)}
                        className="mt-0.5 text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="block font-bold">{r.label}</span>
                        <span className="text-[11px] text-slate-500 font-normal">{r.description}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount Demanded if applicable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Amount Demanded (USD, if any):</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={amountDemanded}
                  onChange={(e) => setAmountDemanded(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Automatic Evidence Capture:</label>
                <div className="p-2 bg-slate-100 rounded-lg text-[11px] text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Chat logs and listing snapshots will be attached automatically (FR-17)</span>
                </div>
              </div>
            </div>

            {/* Description Narrative */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Statement & Incident Description:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened (e.g. landlord demanded $50 via EcoCash before allowing viewing, claimed to be out of town...)"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Submit Report to Safety Queue</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
