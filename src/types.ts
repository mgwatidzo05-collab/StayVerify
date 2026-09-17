export type UserRole = 'student' | 'landlord' | 'admin' | 'housing_office';

export type VerificationTier = 'unverified' | 'document_verified' | 'physically_verified';

export type DocumentType = 'title_deed' | 'utility_bill' | 'council_rates' | 'agency_mandate' | 'national_id';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string; // Private by default (NFR-02)
  isPhoneVisibleToMatch?: boolean;
  studentNumber?: string; // e.g. N0231498B for NUST (FR-01)
  institution?: string; // e.g. National University of Science and Technology
  isStudentVerified?: boolean;
  landlordVerificationTier?: VerificationTier;
  accessKey?: string; // Access key provided by admin to access landlord portal
  password?: string; // Optional password
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  landlordId: string;
  landlordName: string;
  documentType: DocumentType;
  documentNumber?: string;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  status: VerificationStatus;
  reviewedByAdminId?: string;
  adminReviewNotes?: string;
  reviewedAt?: string;
}

export interface PhysicalVerificationVisit {
  id: string;
  listingId: string;
  listingTitle: string;
  landlordId: string;
  inspectorName: string;
  inspectorId: string; // Campus Housing Officer (FR-06)
  visitDate: string;
  status: 'passed' | 'failed' | 'scheduled';
  findings: string;
  securityCheckPassed: boolean;
  waterBackupVerified: boolean;
  electricityVerified: boolean;
  amenitiesMatchListing: boolean;
  approvedBadgeTier: VerificationTier;
}

export interface ListingAmenity {
  id: string;
  label: string;
  category: 'utilities' | 'security' | 'comfort' | 'study';
  iconName: string;
}

export interface TimestampedMedia {
  id: string;
  url: string;
  caption: string;
  isWalkthroughVideo?: boolean;
  timestamp: string; // EXIF or verified capture date
  cameraMetadataVerified: boolean;
  isOriginalChecked: boolean;
}

export type ListingStatus = 'active' | 'suspended_under_review' | 'banned' | 'rented';

export interface Listing {
  id: string;
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  landlordPhone?: string; // Direct WhatsApp contact number for student-landlord communication
  landlordTier: VerificationTier;
  title: string;
  description: string;
  address: string;
  suburb: string; // e.g. Riverside, Selborne Park, Matsheumhlope, Woodlands, Bulawayo CBD
  googleMapUrl?: string; // Google Maps location URL, pin link, or coordinates entered by landlord
  distanceToCampusKm: number; // e.g. 1.2 km to NUST main gate
  walkingMinutes: number;
  pricePerMonthUsd: number;
  depositRequiredUsd: number;
  depositPolicy: string; // e.g. 'Pay only after physical walk-through and signed key exchange'
  roomType: 'single' | 'two_sharing' | 'four_sharing' | 'ensuite_cottage' | 'studio';
  totalRooms: number;
  availableSpots: number;
  genderPreference: 'any' | 'female_only' | 'male_only';
  amenities: string[];
  media: TimestampedMedia[];
  verificationBadge: VerificationTier;
  physicalVisitId?: string;
  status: ListingStatus;
  reportCount: number;
  viewsCount: number;
  scamWarningFlags?: string[];
  createdAt: string;
  updatedAt: string;
  ratingAverage: number;
  ratingCount: number;
}

export interface Review {
  id: string;
  listingId: string;
  studentId: string;
  studentName: string;
  isVerifiedPastTenant: boolean; // FR-19 (tied to confirmed tenancy)
  tenancyPeriod: string; // e.g. "Feb 2025 - Nov 2025"
  rating: number; // 1-5
  subRatings: {
    safety: number;
    utilitiesReliability: number;
    landlordResponsiveness: number;
    valueForMoney: number;
  };
  comment: string;
  isFlaggedForScamLanguage?: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isSystemWarning?: boolean;
  flaggedScamPhrases?: string[];
}

export interface Conversation {
  id: string;
  studentId: string;
  studentName: string;
  landlordId: string;
  landlordName: string;
  listingId: string;
  listingTitle: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCountStudent: number;
  unreadCountLandlord: number;
  hasLandlordPendingReport?: boolean; // FR-15 notification
}

export type ScamReportReason =
  | 'advance_deposit_before_viewing'
  | 'impersonating_owner'
  | 'fake_photos_or_stolen_listing'
  | 'unreachable_after_payment_demand'
  | 'room_not_available_or_already_rented'
  | 'unsafe_living_conditions'
  | 'threats_or_harassment';

export type ReportResolutionStatus = 'open' | 'under_investigation' | 'resolved_dismissed' | 'resolved_warning_issued' | 'resolved_listing_banned';

export interface ScamReport {
  id: string;
  caseNumber: string; // e.g. SV-CASE-2026-089
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  targetListingId?: string;
  targetListingTitle?: string;
  targetUserId: string;
  targetUserName: string;
  reason: ScamReportReason;
  reasonLabel: string;
  description: string;
  amountDemandedUsd?: number;
  attachedChatLogSnapshot?: {
    messages: { sender: string; text: string; time: string }[];
  };
  attachedListingSnapshot?: Partial<Listing>;
  evidenceFiles?: string[];
  status: ReportResolutionStatus;
  adminNotes?: string;
  handledByAdminId?: string;
  isThresholdAutoSuspension?: boolean; // FR-18 trigger
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  actionType:
    | 'landlord_verified'
    | 'landlord_rejected'
    | 'landlord_added_by_admin'
    | 'landlord_removed_by_admin'
    | 'student_registered'
    | 'student_added_by_admin'
    | 'student_removed_by_admin'
    | 'physical_visit_logged'
    | 'listing_created'
    | 'listing_updated'
    | 'listing_deleted'
    | 'listing_auto_suspended'
    | 'listing_manually_banned'
    | 'listing_restored'
    | 'scam_report_filed'
    | 'scam_report_resolved'
    | 'dossier_exported_for_police';
  targetEntityId: string;
  targetEntityType: 'listing' | 'user' | 'report' | 'verification_doc';
  details: string;
  timestamp: string;
}

export interface StudentPreferences {
  maxBudgetUsd: number;
  minBudgetUsd: number;
  preferredRoomType: string[];
  maxDistanceKm: number;
  genderPreference: string;
  suburbs: string[];
  requiredAmenities: string[];
  studyHabit: 'quiet_night_owl' | 'early_bird' | 'moderate' | 'group_study';
  cleanlinessStandard: 'very_strict' | 'moderate' | 'relaxed';
  dietaryOrLifestyle: string[];
}

export interface RoommateProfile {
  id: string;
  studentId: string;
  name: string;
  program: string; // e.g. BSc Computer Science (Year 3)
  institution: string;
  budgetPerPersonUsd: number;
  preferredSuburbs: string[];
  studyHabits: string;
  cleanliness: string;
  bio: string;
  compatibilityScore?: number;
  lookingForGender: 'female_only' | 'male_only' | 'any';
  verifiedStudent: boolean;
}
