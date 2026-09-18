import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'drawer' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // If running in browser where neither prompt nor iOS (e.g. standard desktop Firefox)
  // we still provide an install/shortcut guide on click if in banner or drawer mode
  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General prompt or info
      setShowIOSGuide(true);
    }
  };

  const buttonContent = (
    <>
      <Download className="w-3.5 h-3.5 shrink-0" />
      <span>Install App</span>
    </>
  );

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleAction}
          className={`flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition ${className}`}
          title="Install StayVerify App on your device"
        >
          {buttonContent}
        </button>
      )}

      {variant === 'drawer' && (
        <button
          onClick={handleAction}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-xs shadow-xs transition hover:brightness-105 active:scale-[0.99] ${className}`}
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <div className="text-left">
              <div className="text-xs font-black">Install StayVerify App</div>
              <div className="text-[10px] text-rose-100 font-normal">Add to your home screen for quick offline access</div>
            </div>
          </div>
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Download className="w-4 h-4 text-white" />
          </div>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`p-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Install StayVerify Mobile App</p>
              <p className="text-[11px] text-slate-500">Fast access to verified rooms right from your home screen</p>
            </div>
          </div>
          <button
            onClick={handleAction}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-xs shrink-0"
          >
            Install
          </button>
        </div>
      )}

      {/* Guide Dialog for iOS and browsers requiring manual Add to Home Screen */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <Smartphone className="w-4 h-4 text-rose-600" />
                <span>Install StayVerify on your Phone</span>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    Tap the Share / Menu icon
                    <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    In Safari (bottom bar) or Chrome (top-right menu dots).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    Select "Add to Home Screen"
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Works offline and launches as a native standalone app!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
