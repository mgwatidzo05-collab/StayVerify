import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ShieldCheck, ArrowRight, UserPlus, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const StudentLogin: React.FC = () => {
  const { loginStudent, registerStudent, allUsers } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regStudentNumber, setRegStudentNumber] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const students = allUsers.filter(u => u.role === 'student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your Student ID or Email');
      return;
    }

    const res = loginStudent(identifier, password);
    if (!res.success) {
      setError(res.error || 'Student login failed');
    }
  };

  const handleDemoLogin = (studentIdOrEmail: string) => {
    setError(null);
    const res = loginStudent(studentIdOrEmail);
    if (!res.success) {
      setError(res.error || 'Demo login failed');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regName.trim() || !regStudentNumber.trim() || !regEmail.trim()) {
      setError('Please fill in all required fields (Name, Student ID, Email)');
      return;
    }

    const res = registerStudent({
      name: regName,
      studentNumber: regStudentNumber,
      email: regEmail,
      phone: regPhone || '+263 77 123 4567',
      password: regPassword || 'student123'
    });

    if (!res.success) {
      setError(res.error || 'Registration failed');
    } else {
      setSuccessMsg('Registration successful! Logging you in...');
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Student Portal Login</h2>
          <p className="text-xs text-rose-100 mt-1 max-w-sm mx-auto">
            Log in with your personal email or Student ID to browse verified accommodation.
          </p>
        </div>

        {/* Tab switch: Login vs Register */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'login'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Existing Student Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'register'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            New Student Register
          </button>
        </div>

        <div className="p-6">
          {/* Note about personal emails */}
          <div className="mb-4 p-2.5 bg-rose-50/60 border border-rose-100 rounded-xl flex items-center gap-2 text-xs text-rose-800">
            <span className="font-bold bg-rose-200/80 text-rose-900 px-1.5 py-0.5 rounded text-[10px]">Personal Email</span>
            <span>Use your personal email (Gmail, Yahoo, Outlook, etc.) to log in. No NUST email required!</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Personal Email or Student ID
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. yourname@gmail.com or N0234819P"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Default: student123</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your student password"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs"
              >
                <span>Log In & Browse Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Login Helper for Reviewers */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Quick Demo Student Accounts
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {students.slice(0, 2).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleDemoLogin(s.email)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.studentNumber || 'Student'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Sipho Ndlovu"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student ID (Reg No.) *
                  </label>
                  <input
                    type="text"
                    value={regStudentNumber}
                    onChange={(e) => setRegStudentNumber(e.target.value)}
                    placeholder="e.g. N0245891C"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. +263 77 123 4567"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Personal Email Address *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com (personal email welcome)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Choose a password (default: student123)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register & Open Room Directory</span>
              </button>
            </form>
          )}

          {/* Student Privacy Note */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Verified Student Network:</strong> Requiring student login prevents fake brokers, scammers, and scraping bots from harvesting contact details.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
