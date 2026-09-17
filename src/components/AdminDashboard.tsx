import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Key,
  Users,
  Building2,
  UserPlus,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  LogOut,
  AlertCircle,
  Home,
  Eye,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    allUsers,
    addLandlord,
    removeLandlord,
    addStudent,
    removeStudent,
    listings,
    deleteListing,
    updateListingStatus,
    setSelectedListing
  } = useApp();

  // Admin login states
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'landlords' | 'students' | 'listings'>('landlords');

  // Copy key notification
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form states: Add Landlord
  const [showAddLandlord, setShowAddLandlord] = useState(false);
  const [landlordName, setLandlordName] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [landlordSuburb, setLandlordSuburb] = useState('Selborne Park');
  const [customAccessKey, setCustomAccessKey] = useState('');
  const [landlordSuccess, setLandlordSuccess] = useState<string | null>(null);

  // Form states: Add Student
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentSuccess, setStudentSuccess] = useState<string | null>(null);

  const landlords = allUsers.filter(u => u.role === 'landlord');
  const students = allUsers.filter(u => u.role === 'student');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!passwordInput.trim()) {
      setLoginError('Please enter the admin password.');
      return;
    }

    const success = loginAdmin(passwordInput);
    if (!success) {
      setLoginError('Incorrect password. Please try again.');
    } else {
      setPasswordInput('');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateLandlord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landlordName.trim() || !landlordEmail.trim()) return;

    const newLandlord = addLandlord({
      name: landlordName,
      email: landlordEmail,
      phone: landlordPhone || '+263 77 000 0000',
      suburb: landlordSuburb,
      accessKey: customAccessKey.trim() || undefined
    });

    setLandlordSuccess(`Landlord "${newLandlord.name}" created! Access Key: ${newLandlord.accessKey}`);
    setLandlordName('');
    setLandlordEmail('');
    setLandlordPhone('');
    setCustomAccessKey('');
    setTimeout(() => setLandlordSuccess(null), 5000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentRegNo.trim() || !studentEmail.trim()) return;

    const newStudent = addStudent({
      name: studentName,
      studentNumber: studentRegNo,
      email: studentEmail,
      phone: studentPhone || '+263 77 000 0000'
    });

    setStudentSuccess(`Student "${newStudent.name}" (${newStudent.studentNumber}) added successfully!`);
    setStudentName('');
    setStudentRegNo('');
    setStudentEmail('');
    setStudentPhone('');
    setTimeout(() => setStudentSuccess(null), 4000);
  };

  // Screen 1: Private Admin Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-6 text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Private Admin Portal</h2>
            <p className="text-xs text-purple-200 mt-1 max-w-xs mx-auto">
              Restricted stakeholder management area. Enter the administrator password to proceed.
            </p>
          </div>

          <div className="p-6">
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Administrator Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-3 rounded-xl transition shadow-xs"
              >
                Access Admin Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Unlocked Stakeholder Administration
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight">StayVerify Stakeholder Administration</h2>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Private Admin Session
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage landlords, issue access keys, and oversee student accounts and accommodation listings.
            </p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition border border-slate-700 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock / Exit Admin</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('landlords')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'landlords'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Landlords & Access Keys ({landlords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'students'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students Directory ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'listings'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>All Accommodations ({listings.length})</span>
        </button>
      </div>

      {/* TAB 1: LANDLORDS MANAGEMENT */}
      {activeTab === 'landlords' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Registered Landlords & Access Keys</h3>
              <p className="text-xs text-slate-500">
                Landlords require their unique Access Key to access their portal and add student rooms.
              </p>
            </div>

            <button
              onClick={() => setShowAddLandlord(!showAddLandlord)}
              className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddLandlord ? 'Cancel' : 'Add New Landlord'}</span>
            </button>
          </div>

          {landlordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{landlordSuccess}</span>
            </div>
          )}

          {/* Add Landlord Form Card */}
          {showAddLandlord && (
            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-3">
                New Landlord Details & Key Generation
              </h4>
              <form onSubmit={handleCreateLandlord} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Landlord Full Name *
                    </label>
                    <input
                      type="text"
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      placeholder="e.g. Mr. David Dube"
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={landlordEmail}
                      onChange={(e) => setLandlordEmail(e.target.value)}
                      placeholder="e.g. d.dube.properties@gmail.com"
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={landlordPhone}
                      onChange={(e) => setLandlordPhone(e.target.value)}
                      placeholder="e.g. +263 77 345 6789"
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Primary Property Suburb
                    </label>
                    <select
                      value={landlordSuburb}
                      onChange={(e) => setLandlordSuburb(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Selborne Park">Selborne Park</option>
                      <option value="Riverside">Riverside</option>
                      <option value="Matsheumhlope">Matsheumhlope</option>
                      <option value="Kumalo">Kumalo</option>
                      <option value="Bradfield">Bradfield</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Custom Access Key (Optional)
                    </label>
                    <input
                      type="text"
                      value={customAccessKey}
                      onChange={(e) => setCustomAccessKey(e.target.value)}
                      placeholder="Auto-generated if blank"
                      className="w-full text-xs font-mono uppercase px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLandlord(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
                  >
                    Save Landlord & Issue Key
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Landlords Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Landlord Name</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Assigned Access Key</th>
                    <th className="p-3.5">Rooms Posted</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {landlords.map((landlord) => {
                    const landlordListings = listings.filter(l => l.landlordId === landlord.id);
                    return (
                      <tr key={landlord.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {landlord.name.charAt(0)}
                            </div>
                            <span>{landlord.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          <div>{landlord.email}</div>
                          <div className="text-[11px] text-slate-400">{landlord.phone || 'No phone'}</div>
                        </td>
                        <td className="p-3.5">
                          {landlord.accessKey ? (
                            <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                              <span className="font-mono font-bold text-purple-800 text-xs">
                                {landlord.accessKey}
                              </span>
                              <button
                                onClick={() => handleCopyKey(landlord.accessKey!)}
                                className="text-purple-600 hover:text-purple-800 p-0.5 rounded transition"
                                title="Copy Access Key"
                              >
                                {copiedKey === landlord.accessKey ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">None assigned</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-700 font-semibold">
                          {landlordListings.length} accommodation(s)
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove landlord "${landlord.name}"?`)) {
                                removeLandlord(landlord.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded hover:bg-red-50 transition"
                            title="Remove Landlord"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Enrolled NUST Students</h3>
              <p className="text-xs text-slate-500">
                Only authenticated students can browse verified rooms and view contact numbers.
              </p>
            </div>

            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddStudent ? 'Cancel' : 'Add New Student'}</span>
            </button>
          </div>

          {studentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{studentSuccess}</span>
            </div>
          )}

          {/* Add Student Form */}
          {showAddStudent && (
            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-3">
                Register Student Account
              </h4>
              <form onSubmit={handleCreateStudent} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Sipho Ndlovu"
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      NUST Student Reg No. *
                    </label>
                    <input
                      type="text"
                      value={studentRegNo}
                      onChange={(e) => setStudentRegNo(e.target.value)}
                      placeholder="e.g. N0245891C"
                      className="w-full text-xs uppercase px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Student Personal Email *
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="e.g. sipho.ndlovu@gmail.com"
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="e.g. +263 77 123 4567"
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
                  >
                    Save & Register Student
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Student Reg Number</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        {student.name}
                      </td>
                      <td className="p-3.5 font-mono text-purple-700 font-bold">
                        {student.studentNumber || 'N/A'}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {student.email}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Student
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove student "${student.name}"?`)) {
                              removeStudent(student.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded hover:bg-red-50 transition"
                          title="Remove Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOMMODATION LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">All Accommodation Listings ({listings.length})</h3>
            <p className="text-xs text-slate-500">
              Oversee and verify all room postings active on the platform.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Property</th>
                    <th className="p-3.5">Landlord</th>
                    <th className="p-3.5">Suburb</th>
                    <th className="p-3.5">Rent</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-bold text-slate-900 max-w-xs">
                        <div className="truncate">{listing.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal truncate">{listing.address}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {listing.landlordName}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {listing.suburb}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        ${listing.pricePerMonthUsd}/mo
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          listing.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {listing.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="text-purple-600 hover:text-purple-800 font-bold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete listing "${listing.title}"?`)) {
                              deleteListing(listing.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
