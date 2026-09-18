import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';

export const SRSTraceabilityModal: React.FC = () => {
  const { isSrsModalOpen, setIsSrsModalOpen, setActiveTab } = useApp();
  const [filterCategory, setFilterCategory] = useState<'all' | 'account' | 'listings' | 'comms' | 'safety' | 'admin' | 'nfr'>('all');

  if (!isSrsModalOpen) return null;

  const REQUIREMENTS = [
    {
      id: 'STD-01',
      category: 'account',
      title: 'Student Registration & Credibility',
      spec: 'The system shall allow students to register using an email address and (optionally) their university student number for added credibility.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-02',
      category: 'account',
      title: 'Landlord Proof-of-Ownership Document Submission',
      spec: 'The system shall allow landlords/agents to register and submit proof-of-ownership documentation (title deed, utility bill, or agency letter) for verification.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'landlord_portal'
    },
    {
      id: 'STD-03',
      category: 'account',
      title: 'Admin Document Review Queue',
      spec: 'The system shall allow an administrator to manually review and approve/reject landlord verification submissions.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'admin_portal'
    },
    {
      id: 'STD-04',
      category: 'account',
      title: 'Verification Badge Tier System',
      spec: 'The system shall display a verification badge (Unverified / Document-Verified / Physically-Verified) on every landlord profile and listing.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-05',
      category: 'account',
      title: 'Account Security & Password Management',
      spec: 'The system shall support password reset and basic account security (e.g. email confirmation on signup).',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-06',
      category: 'account',
      title: 'Campus Physical Verification Visits',
      spec: 'The system should allow a campus representative to conduct and log a physical verification visit, upgrading a listing\'s badge tier.',
      priority: 'Should',
      status: 'Implemented',
      targetTab: 'admin_portal'
    },
    {
      id: 'STD-07',
      category: 'listings',
      title: 'Verified Listing Creation Wizard',
      spec: 'The system shall allow verified landlords to create listings with price, location, room type, amenities, and photos/video.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'landlord_portal'
    },
    {
      id: 'STD-08',
      category: 'listings',
      title: 'Timestamped Walkthrough Photo / Video Requirement',
      spec: 'The system shall require at least one timestamped photo or short video walkthrough per listing to reduce stock-photo/stolen-image scams.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'landlord_portal'
    },
    {
      id: 'STD-09',
      category: 'listings',
      title: 'Comprehensive Multi-Factor Search & Filtering',
      spec: 'The system shall allow students to filter and search listings by budget, distance from campus, room type, and verification tier.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-10',
      category: 'listings',
      title: 'Intelligent Student Recommendation Matching',
      spec: 'The system shall rank/recommend listings to a student based on their stated preferences (budget, location, roommate needs).',
      priority: 'Should',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-11',
      category: 'listings',
      title: 'Roommate Matching Questionnaire & Compatibility',
      spec: 'The system should support a roommate-matching questionnaire to pair compatible co-tenants.',
      priority: 'Could',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-12',
      category: 'listings',
      title: 'Anti-Fraud Duplicate & Blacklist Blocking',
      spec: 'The system shall prevent a landlord from publishing a listing that has already been reported and confirmed fraudulent under a different account.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'landlord_portal'
    },
    {
      id: 'STD-13',
      category: 'comms',
      title: 'In-Platform Safe Messaging',
      spec: 'The system shall provide in-platform messaging between students and landlords without requiring immediate exchange of personal phone numbers.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'messages'
    },
    {
      id: 'STD-14',
      category: 'comms',
      title: 'Evidence Audit Message Logging',
      spec: 'The system shall log all in-platform messages for use as evidence in the event of a dispute or scam report.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'messages'
    },
    {
      id: 'STD-15',
      category: 'comms',
      title: 'Pending Scam Report Safety Alerts in Chat',
      spec: 'The system should notify a student if a landlord they are messaging has a pending or upheld scam report against them.',
      priority: 'Should',
      status: 'Implemented',
      targetTab: 'messages'
    },
    {
      id: 'STD-16',
      category: 'safety',
      title: 'Report Scam / Issue Functionality',
      spec: 'The system shall provide a "Report Scam/Issue" function on every listing and every user profile.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-17',
      category: 'safety',
      title: 'Automated Evidence Capture & Admin Routing',
      spec: 'The system shall route scam reports to an administrator review queue with supporting evidence (chat logs, listing history).',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'admin_portal'
    },
    {
      id: 'STD-18',
      category: 'safety',
      title: 'Threshold-Based Automatic Listing Suspension',
      spec: 'The system shall suspend a listing automatically pending review once it accumulates a defined threshold of reports.',
      priority: 'Should',
      status: 'Implemented',
      targetTab: 'admin_portal'
    },
    {
      id: 'STD-19',
      category: 'safety',
      title: 'Verified Past Tenant Reviews & Ratings',
      spec: 'The system shall allow verified past tenants to leave a rating and written review tied to a confirmed tenancy.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'browse'
    },
    {
      id: 'STD-20',
      category: 'safety',
      title: 'Real-Time Scam Pattern & Keyword Flagging',
      spec: 'The system should flag reviews or listings for admin attention if they contain patterns matching known scam language (e.g. "pay before viewing").',
      priority: 'Could',
      status: 'Implemented',
      targetTab: 'messages'
    },
    {
      id: 'STD-21',
      category: 'admin',
      title: 'Administrator Operations Dashboard',
      spec: 'The system shall provide an administrator dashboard summarising pending verifications, open scam reports, and platform activity.',
      priority: 'Must',
      status: 'Implemented',
      targetTab: 'admin_portal'
    },
    {
      id: 'STD-22',
      category: 'admin',
      title: 'University Housing Office Telemetry Portal',
      spec: 'The system should provide the university housing office with read-only access to aggregated (anonymised) scam-report statistics.',
      priority: 'Should',
      status: 'Implemented',
      targetTab: 'admin_portal'
    },
    {
      id: 'STD-23',
      category: 'admin',
      title: 'Police & Disciplinary Case Dossier Export',
      spec: 'The system could provide an audit-export function (PDF/CSV) of a specific case\'s evidence trail for police or university disciplinary use.',
      priority: 'Could',
      status: 'Implemented',
      targetTab: 'admin_portal'
    }
  ];

  const filteredReqs = filterCategory === 'all'
    ? REQUIREMENTS
    : REQUIREMENTS.filter(r => r.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">StayVerify Student Accommodation & Safety Standards</h2>
              <p className="text-[11px] text-slate-400">
                National University of Science and Technology (NUST) &bull; Verified Housing Guidelines &bull; Student Protection Charter
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSrsModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              filterCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            All Standards ({REQUIREMENTS.length})
          </button>
          <button
            onClick={() => setFilterCategory('account')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              filterCategory === 'account' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Identity & Verification
          </button>
          <button
            onClick={() => setFilterCategory('listings')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              filterCategory === 'listings' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Listings & Roommates
          </button>
          <button
            onClick={() => setFilterCategory('comms')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              filterCategory === 'comms' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Safe In-App Messaging
          </button>
          <button
            onClick={() => setFilterCategory('safety')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              filterCategory === 'safety' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Scam Defense & Reporting
          </button>
          <button
            onClick={() => setFilterCategory('admin')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              filterCategory === 'admin' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            University Oversight & Records
          </button>
        </div>

        {/* Requirements Table */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="divide-y divide-slate-100">
            {filteredReqs.map((req) => (
              <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                      {req.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{req.title}</h3>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      req.priority === 'Must' ? 'bg-emerald-100 text-emerald-800' : req.priority === 'Should' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {req.priority === 'Must' ? 'Core Guarantee' : req.priority === 'Should' ? 'Recommended Standard' : 'Extended Safety'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-sans">{req.spec}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Enforced Live
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab(req.targetTab as any);
                      setIsSrsModalOpen(false);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] px-2.5 py-1 rounded font-medium transition flex items-center gap-1"
                  >
                    <span>View Section</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
