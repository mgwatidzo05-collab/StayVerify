import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    allUsers,
    setCurrentUser
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('N0248912K');
  const [institution, setInstitution] = useState('National University of Science & Technology (NUST)');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authModalMode === 'login') {
      const match = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        setCurrentUser(match);
        setSuccessMessage(`Welcome back, ${match.name}!`);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMessage(null);
        }, 1200);
      } else {
        // Log in default user
        setSuccessMessage(`Signed in successfully as ${email.split('@')[0]}!`);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMessage(null);
        }, 1200);
      }
    } else if (authModalMode === 'register_student') {
      setSuccessMessage(`Student account registered for ${name} with NUST ID ${studentNumber}!`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMessage(null);
      }, 1500);
    } else if (authModalMode === 'register_landlord') {
      setSuccessMessage(`Landlord account created for ${name}. Please upload proof of ownership for document verification.`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMessage(null);
      }, 1500);
    } else if (authModalMode === 'reset_password') {
      setSuccessMessage(`Password reset link dispatched securely to ${email}.`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMessage(null);
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setSuccessMessage(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Success</h3>
            <p className="text-xs text-slate-600">{successMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {authModalMode === 'login' && 'Sign In to StayVerify'}
                  {authModalMode === 'register_student' && 'Register Student Account'}
                  {authModalMode === 'register_landlord' && 'Register Landlord / Agent'}
                  {authModalMode === 'reset_password' && 'Reset Password'}
                </h3>
                <p className="text-xs text-slate-500">Official Student Accommodation Safety Network</p>
              </div>
            </div>

            {/* Quick Switch Mode Tabs */}
            {authModalMode !== 'reset_password' && (
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    authModalMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register_student')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    authModalMode === 'register_student' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Student Sign-up
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register_landlord')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    authModalMode === 'register_landlord' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Landlord Sign-up
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {authModalMode !== 'login' && authModalMode !== 'reset_password' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tapiwa Moyo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@students.nust.ac.zw or email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              {authModalMode === 'register_student' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Student Reg Number</label>
                    <input
                      type="text"
                      placeholder="e.g. N0234819P"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">University / Campus</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs truncate"
                    />
                  </div>
                </div>
              )}

              {authModalMode !== 'reset_password' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Password</label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthModalMode('reset_password')}
                        className="text-blue-600 hover:underline text-[11px]"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg transition shadow-xs mt-2"
              >
                {authModalMode === 'login' && 'Sign In'}
                {authModalMode === 'register_student' && 'Complete Student Registration'}
                {authModalMode === 'register_landlord' && 'Register Landlord Profile'}
                {authModalMode === 'reset_password' && 'Send Password Reset Link'}
              </button>

              {authModalMode === 'reset_password' && (
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
                >
                  Back to Sign In
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
