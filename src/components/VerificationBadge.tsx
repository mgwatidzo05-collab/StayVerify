import React from 'react';
import { VerificationTier } from '../types';
import { ShieldCheck, FileCheck2, AlertTriangle, Sparkles } from 'lucide-react';

interface VerificationBadgeProps {
  tier: VerificationTier;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
  onClick?: () => void;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  tier,
  size = 'md',
  showDetails = false,
  className = '',
  onClick
}) => {
  if (tier === 'physically_verified') {
    return (
      <div
        id={`badge-physically-verified-${size}`}
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3.5 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        } bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs ${
          onClick ? 'cursor-pointer hover:bg-emerald-100' : ''
        } ${className}`}
        title="Physically inspected by Campus Housing Representative"
      >
        <ShieldCheck className={size === 'lg' ? 'w-4 h-4 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
        <span className="font-semibold tracking-tight">Physically Verified</span>
        {showDetails && <span className="text-emerald-700 text-[11px] font-normal pl-1 border-l border-emerald-300">Campus Inspected</span>}
      </div>
    );
  }

  if (tier === 'document_verified') {
    return (
      <div
        id={`badge-document-verified-${size}`}
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3.5 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        } bg-blue-50 text-blue-800 border-blue-300 shadow-xs ${
          onClick ? 'cursor-pointer hover:bg-blue-100' : ''
        } ${className}`}
        title="Deed & Identity Verified by Admin"
      >
        <FileCheck2 className={size === 'lg' ? 'w-4 h-4 text-blue-600' : 'w-3.5 h-3.5 text-blue-600'} />
        <span className="font-semibold tracking-tight">Document Verified</span>
        {showDetails && <span className="text-blue-700 text-[11px] font-normal pl-1 border-l border-blue-300">Deed/Bill Confirmed</span>}
      </div>
    );
  }

  return (
    <div
      id={`badge-unverified-${size}`}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-3.5 py-1.5 text-sm'
          : 'px-2.5 py-1 text-xs'
      } bg-amber-50 text-amber-800 border-amber-300 ${
        onClick ? 'cursor-pointer hover:bg-amber-100' : ''
      } ${className}`}
      title="Self-declared listing: Not verified by platform or campus housing"
    >
      <AlertTriangle className={size === 'lg' ? 'w-4 h-4 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
      <span className="font-medium tracking-tight">Unverified</span>
      {showDetails && <span className="text-amber-700 text-[11px] font-normal pl-1 border-l border-amber-300">Self-Declared</span>}
    </div>
  );
};
