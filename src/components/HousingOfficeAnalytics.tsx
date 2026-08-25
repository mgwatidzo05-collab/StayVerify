import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  ShieldCheck,
  Building,
  TrendingDown,
  Download,
  School,
  AlertOctagon,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export const HousingOfficeAnalytics: React.FC = () => {
  const { listings, reports, documents, physicalVisits, exportCaseDossier } = useApp();

  const totalVerifiedListings = listings.filter(l => l.verificationBadge === 'physically_verified' || l.verificationBadge === 'document_verified').length;
  const totalStudentBeds = listings.reduce((acc, curr) => acc + (curr.totalRooms || 0), 0);
  const totalBannedFraudsters = listings.filter(l => l.status === 'banned' || l.status === 'suspended_under_review').length;
  const totalScamReports = reports.length;
  const totalInterceptions = reports.filter(r => r.isThresholdAutoSuspension || r.status === 'resolved_listing_banned' || r.status === 'resolved_warning_issued').length;

  const interceptionRate = totalScamReports > 0 ? Math.round((totalInterceptions / totalScamReports) * 100) : 100;

  // Suburb pricing distribution
  const suburbsStats = [
    { name: 'Riverside (Adjacent to Campus)', avgPrice: 120, verifiedBeds: 18, riskRating: 'Low Risk' },
    { name: 'Selborne Park (Near Back Gate)', avgPrice: 135, verifiedBeds: 14, riskRating: 'Low Risk' },
    { name: 'Woodlands', avgPrice: 75, verifiedBeds: 24, riskRating: 'Low Risk' },
    { name: 'Matsheumhlope', avgPrice: 110, verifiedBeds: 6, riskRating: 'Moderate - High Alert' },
  ];

  const handleExportSummaryCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Approved Student Beds,${totalStudentBeds}\n`
      + `Verified Landlord Entities,${documents.filter(d => d.status === 'approved').length}\n`
      + `Physical Campus Audits Conducted,${physicalVisits.length}\n`
      + `Reported Scam Incidents,${totalScamReports}\n`
      + `Scam Interception Rate,${interceptionRate}%\n`
      + `Suspended Fraudulent Listings,${totalBannedFraudsters}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NUST_Student_Housing_Safety_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="housing-office-analytics" className="space-y-6">
      {/* Institutional Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <School className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              University Accommodation & Student Welfare Portal (FR-22)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            NUST Off-Campus Safety & Allocation Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Aggregated institutional oversight for university housing liaison officers, student affairs deans, and campus safety monitoring.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportSummaryCSV}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Institutional CSV (FR-23)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Verified Student Beds</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalStudentBeds} Spots</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {totalVerifiedListings} audited premises active
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pre-Payment Scam Interception</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600">{interceptionRate}%</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Target &ge; 80% (SRS Success Criteria 2.3)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Physical Audits Logged</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{physicalVisits.length} Audits</div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">
            Conducted by NUST Housing Officers
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Fraud Attempts Neutralized</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{totalBannedFraudsters} Intercepted</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Zero student financial loss logged
          </p>
        </div>
      </div>

      {/* Suburb Safety & Price Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Off-Campus Suburb Breakdown (NUST Environs)</h2>
            <p className="text-xs text-slate-500">Average student monthly rental rates and verified capacity by residential zone.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Residential Suburb</th>
                  <th className="py-2.5 px-3">Avg Rate (USD)</th>
                  <th className="py-2.5 px-3">Verified Beds</th>
                  <th className="py-2.5 px-3">Safety Posture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suburbsStats.map((suburb) => (
                  <tr key={suburb.name} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{suburb.name}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-bold">${suburb.avgPrice} /mo</td>
                    <td className="py-2.5 px-3 text-slate-700">{suburb.verifiedBeds} spots</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        suburb.riskRating.includes('Low') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {suburb.riskRating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal & Disciplinary Export Panel (FR-23) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Campus Security & Police Dossiers (FR-23)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Generate court-admissible audit dossiers containing chat transcripts and suspect identities.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {reports.map((report) => (
              <div key={report.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900 font-mono text-[11px]">{report.caseNumber}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{report.reasonLabel}</p>
                  <p className="text-[10px] text-slate-400">Target: {report.targetUserName}</p>
                </div>

                <button
                  onClick={() => exportCaseDossier(report.id)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1"
                >
                  <Printer className="w-3 h-3 text-emerald-400" />
                  <span>Dossier</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
