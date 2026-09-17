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
  // Completely removed physically verified and campus inspected tags as requested
  if (tier === 'physically_verified') {
    return null;
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
        title="Identity Verified by Admin"
      >
        <FileCheck2 className={size === 'lg' ? 'w-4 h-4 text-blue-600' : 'w-3.5 h-3.5 text-blue-600'} />
        <span className="font-semibold tracking-tight">Verified Landlord</span>
      </div>
    );
  }

  return null;
};
