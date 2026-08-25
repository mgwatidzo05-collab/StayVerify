import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationDocument, ScamReport, Listing, ReportResolutionStatus } from '../types';
import { VerificationBadge } from './VerificationBadge';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Search,
  Download,
  Clock,
  UserCheck,
  Calendar,
  AlertOctagon
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    documents,
    reviewVerificationDocument,
    reports,
    resolveScamReport,
    listings,
    updateListingStatus,
    physicalVisits,
    logPhysicalVisit,
    auditLogs,
    exportCaseDossier
  } = useApp();

  const [activeTab, setActiveTab] = useState<'scam_reports' | 'document_queue' | 'physical_inspections' | 'audit_log'>('scam_reports');
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null);
  const [adminResolutionNotes, setAdminResolutionNotes] = useState('');
  const [docReviewNotes, setDocReviewNotes] = useState('');

  // Physical Inspection Visit Log Form states (FR-06)
  const [showLogVisitModal, setShowLogVisitModal] = useState(false);
  const [visitListingId, setVisitListingId] = useState(listings[0]?.id || '');
  const [inspectorName, setInspectorName] = useState('T. Sibindi (Senior Housing Officer)');
  const [inspectorId, setInspectorId] = useState('HO-NUST-04');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitFindings, setVisitFindings] = useState('Verified borehole water output, 5kVA solar inverter, secure perimeter lock, clean study desk facilities.');
  const [securityCheckPassed, setSecurityCheckPassed] = useState(true);
  const [waterBackupVerified, setWaterBackupVerified] = useState(true);
  const [electricityVerified, setElectricityVerified] = useState(true);

  const pendingDocs = documents.filter(d => d.status === 'pending');
  const openReports = reports.filter(r => r.status === 'open' || r.status === 'under_investigation');

  const handleResolveReport = (reportId: string, resolution: ReportResolutionStatus) => {
    resolveScamReport(reportId, resolution, adminResolutionNotes || `Resolved with status ${resolution} by safety team.`);
    setSelectedReport(null);
    setAdminResolutionNotes('');
  };

  const handleDocReview = (docId: string, status: 'approved' | 'rejected') => {
    reviewVerificationDocument(docId, status, docReviewNotes || `Reviewed and marked as ${status} by admin.`);
    setSelectedDoc(null);
    setDocReviewNotes('');
  };

  const handleSavePhysicalVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetListing = listings.find(l => l.id === visitListingId);
    if (!targetListing) return;

    logPhysicalVisit({
      listingId: visitListingId,
      listingTitle: targetListing.title,
      landlordId: targetListing.landlordId,
      inspectorName,
      inspectorId,
      visitDate,
      status: 'passed',
      findings: visitFindings,
      securityCheckPassed,
      waterBackupVerified,
      electricityVerified,
      amenitiesMatchListing: true,
      approvedBadgeTier: 'physically_verified'
    });

    setShowLogVisitModal(false);
  };

  return (
    <div id="admin-dashboard" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              StayVerify Administrative Command Center (FR-21)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Trust, Safety & Verification Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Review proof of ownership deeds, investigate student scam reports, enforce automatic listing suspensions, and record campus physical audits.
          </p>
        </div>

        {/* Operational metric counters */}
        <div className="flex gap-2">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center min-w-[100px]">
            <span className="text-xs text-slate-400 font-semibold block">Open Reports</span>
            <span className="text-xl font-bold text-rose-400">{openReports.length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center min-w-[100px]">
            <span className="text-xs text-slate-400 font-semibold block">Pending Docs</span>
            <span className="text-xl font-bold text-amber-400">{pendingDocs.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          id="admin-tab-reports"
          onClick={() => setActiveTab('scam_reports')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'scam_reports'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Scam Investigation Queue ({openReports.length})</span>
        </button>

        <button
          id="admin-tab-docs"
          onClick={() => setActiveTab('document_queue')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'document_queue'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-blue-400" />
          <span>Proof Document Verifications ({pendingDocs.length})</span>
        </button>

        <button
          id="admin-tab-visits"
          onClick={() => setActiveTab('physical_inspections')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'physical_inspections'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Physical Visit Inspection Log (FR-06)</span>
        </button>

        <button
          id="admin-tab-audit"
          onClick={() => setActiveTab('audit_log')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'audit_log'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Immutable Audit Trail (NFR-07)</span>
        </button>
      </div>

      {/* Tab 1: Scam Reports Investigation Queue (FR-17, FR-18) */}
      {activeTab === 'scam_reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reports Table */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Student Scam & Fraud Incident Queue</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {reports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                const isAutoSuspended = report.isThresholdAutoSuspension;

                return (
                  <div
                    key={report.id}
                    onClick={() => {
                      setSelectedReport(report);
                      setAdminResolutionNotes(report.adminNotes || '');
                    }}
                    className={`p-4 cursor-pointer transition flex items-start justify-between gap-3 ${
                      isSelected ? 'bg-purple-50/70 border-l-4 border-purple-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-700">{report.caseNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          report.status === 'under_investigation'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                        {isAutoSuspended && (
                          <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            AUTO-SUSPENDED (FR-18)
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-xs text-slate-900">{report.reasonLabel}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">"{report.description}"</p>
                      <p className="text-[10px] text-slate-400">
                        Complainant: {report.reporterName} &bull; Target Host: {report.targetUserName}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {report.amountDemandedUsd && (
                        <span className="font-bold text-xs text-red-600">${report.amountDemandedUsd} USD</span>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Investigation Detail & Actions */}
          <div className="lg:col-span-5">
            {selectedReport ? (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-24">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Case Investigation Dossier</h3>
                    <p className="font-mono text-xs text-purple-700">{selectedReport.caseNumber}</p>
                  </div>

                  {/* Export Police / Housing Office Case Dossier (FR-23) */}
                  <button
                    onClick={() => exportCaseDossier(selectedReport.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition"
                    title="Export official dossier for Police or Disciplinary Committee"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Export Dossier (FR-23)</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Incident Narrative</span>
                    <p className="text-slate-800 mt-0.5 leading-relaxed italic">"{selectedReport.description}"</p>
                  </div>

                  {/* Auto-Captured Chat Logs (FR-14) */}
                  {selectedReport.attachedChatLogSnapshot?.messages && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px]">
                        Attached Tamper-Evident In-Platform Chat Transcript:
                      </span>
                      <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] space-y-1.5 max-h-40 overflow-y-auto">
                        {selectedReport.attachedChatLogSnapshot.messages.map((m, i) => (
                          <div key={i} className="leading-tight">
                            <span className="text-blue-400 font-bold">{m.sender}</span> <span className="text-slate-500 text-[9px]">{m.time}</span>:
                            <p className="text-slate-200 pl-2">{m.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Resolution Form */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block font-bold text-slate-800 text-xs">Investigation Finding & Action Notes:</label>
                    <textarea
                      rows={3}
                      value={adminResolutionNotes}
                      onChange={(e) => setAdminResolutionNotes(e.target.value)}
                      placeholder="Detail resolution: e.g. Phone number matched blacklist; deposit demand violates Section 5.1; listing permanently banned."
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => handleResolveReport(selectedReport.id, 'resolved_listing_banned')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] py-2 px-2 rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Ban Listing</span>
                      </button>

                      <button
                        onClick={() => handleResolveReport(selectedReport.id, 'resolved_warning_issued')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] py-2 px-2 rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Issue Warning</span>
                      </button>

                      <button
                        onClick={() => handleResolveReport(selectedReport.id, 'resolved_dismissed')}
                        className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-[11px] py-2 px-2 rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Dismiss Case</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-400">
                Select a report from the queue to inspect attached evidence and resolve.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Document Verification Queue (FR-03) */}
      {activeTab === 'document_queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Landlord Proof-of-Ownership Documents</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setDocReviewNotes(doc.adminReviewNotes || '');
                  }}
                  className={`p-4 cursor-pointer transition flex items-start justify-between gap-3 ${
                    selectedDoc?.id === doc.id ? 'bg-purple-50/70 border-l-4 border-purple-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-slate-900 capitalize">{doc.documentType.replace('_', ' ')}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold capitalize ${
                        doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">Landlord: <span className="font-semibold">{doc.landlordName}</span></p>
                    <p className="text-[11px] font-mono text-slate-400">File: {doc.fileName} &bull; Ref: {doc.documentNumber || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            {selectedDoc ? (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-900">Document Verification Audit</h3>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{selectedDoc.id}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <p><strong>Applicant:</strong> {selectedDoc.landlordName}</p>
                    <p><strong>Document:</strong> {selectedDoc.documentType.replace('_', ' ')}</p>
                    <p><strong>Ref Code:</strong> {selectedDoc.documentNumber || 'N/A'}</p>
                    <p><strong>Upload Date:</strong> {new Date(selectedDoc.uploadDate).toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1">Admin Audit Notes / Verification Reference:</label>
                    <textarea
                      rows={3}
                      value={docReviewNotes}
                      onChange={(e) => setDocReviewNotes(e.target.value)}
                      placeholder="e.g. Cross-referenced with Bulawayo Deeds Registry / Municipal Account database..."
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDocReview(selectedDoc.id, 'approved')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Upgrade Tier (FR-03)</span>
                    </button>
                    <button
                      onClick={() => handleDocReview(selectedDoc.id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-400">
                Select a document from the queue to inspect and verify.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Physical Visit Inspections (FR-06) */}
      {activeTab === 'physical_inspections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Campus Housing Representative Physical Audits (FR-06)</h2>
              <p className="text-xs text-slate-500">In-person inspections conducted by NUST housing liaison officers.</p>
            </div>

            <button
              id="log-physical-visit-btn"
              onClick={() => setShowLogVisitModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>+ Log In-Person Inspection Visit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {physicalVisits.map((visit) => (
              <div key={visit.id} className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-xs text-slate-900 truncate">{visit.listingTitle}</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    PASSED
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  "{visit.findings}"
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div><strong>Inspector:</strong> {visit.inspectorName}</div>
                  <div><strong>Inspection Date:</strong> {visit.visitDate}</div>
                  <div><strong>Officer Code:</strong> {visit.inspectorId}</div>
                  <div><strong>Badge Tier Granted:</strong> Physically Verified</div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to log a new physical visit */}
          {showLogVisitModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Log Campus Physical Verification Visit (FR-06)</span>
                </h3>

                <form onSubmit={handleSavePhysicalVisit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Accommodation Listing</label>
                    <select
                      value={visitListingId}
                      onChange={(e) => setVisitListingId(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    >
                      {listings.map(l => (
                        <option key={l.id} value={l.id}>{l.title} ({l.suburb})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Inspector / Officer Name</label>
                      <input
                        type="text"
                        value={inspectorName}
                        onChange={(e) => setInspectorName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Campus Staff ID</label>
                      <input
                        type="text"
                        value={inspectorId}
                        onChange={(e) => setInspectorId(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inspection Findings & Structural Check Notes</label>
                    <textarea
                      rows={3}
                      value={visitFindings}
                      onChange={(e) => setVisitFindings(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowLogVisitModal(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg shadow-xs"
                    >
                      Certify & Upgrade Badge (FR-06)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Immutable Audit Logs (NFR-07) */}
      {activeTab === 'audit_log' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Administrative Decision Audit Trail (NFR-07)</h2>
              <p className="text-xs text-slate-500">Every verification, suspension, and report resolution is cryptographically timestamped.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      {log.actionType}
                    </span>
                    <span className="text-slate-900 font-semibold">{log.actorName}</span>
                    <span className="text-slate-400">({log.actorRole})</span>
                  </div>
                  <p className="text-slate-700 font-sans text-xs">{log.details}</p>
                </div>
                <span className="text-slate-400 text-[11px] shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
