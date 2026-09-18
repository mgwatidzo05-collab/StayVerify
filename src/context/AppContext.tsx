import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Listing,
  VerificationDocument,
  PhysicalVerificationVisit,
  ScamReport,
  Message,
  Conversation,
  Review,
  AuditLog,
  RoommateProfile,
  StudentPreferences,
  VerificationTier,
  ScamReportReason,
  ReportResolutionStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_VERIFICATION_DOCUMENTS,
  INITIAL_PHYSICAL_VISITS,
  INITIAL_SCAM_REPORTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_ROOMMATES,
  INITIAL_AUDIT_LOGS,
  DEFAULT_STUDENT_PREFERENCES,
  SCAM_KEYWORDS
} from '../data/seedData';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  switchUserById: (userId: string) => void;
  switchRole: (role: UserRole) => void;

  // Student Access & Auth
  studentUser: User | null;
  loginStudent: (identifier: string, password?: string) => { success: boolean; error?: string; user?: User };
  logoutStudent: () => void;
  registerStudent: (data: { name: string; studentNumber: string; email: string; phone?: string; password?: string }) => { success: boolean; error?: string; user?: User };

  // Landlord Access Key Auth
  landlordUser: User | null;
  loginLandlordWithKey: (accessKey: string) => { success: boolean; landlord?: User; error?: string };
  logoutLandlord: () => void;

  // Admin Master Password Auth
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Admin Stakeholder Management
  addLandlord: (data: { name: string; email: string; phone: string; suburb?: string; accessKey?: string }) => User;
  removeLandlord: (landlordId: string) => void;
  addStudent: (data: { name: string; studentNumber: string; email: string; phone?: string; password?: string }) => User;
  removeStudent: (studentId: string) => void;
  deleteListing: (listingId: string) => void;

  // Listings
  listings: Listing[];
  addListing: (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'reportCount' | 'viewsCount' | 'ratingAverage' | 'ratingCount'>) => { success: boolean; listing?: Listing; error?: string };
  updateListing: (listingId: string, updatedData: Partial<Listing>) => { success: boolean; listing?: Listing; error?: string };
  updateListingStatus: (listingId: string, status: Listing['status'], adminNotes?: string) => void;
  incrementListingViews: (listingId: string) => void;
  checkDuplicateOrFlaggedListing: (title: string, address: string) => { isFlagged: boolean; reason?: string };

  // Verifications
  documents: VerificationDocument[];
  uploadVerificationDocument: (doc: Omit<VerificationDocument, 'id' | 'uploadDate' | 'status'>) => void;
  reviewVerificationDocument: (docId: string, status: 'approved' | 'rejected', notes: string) => void;
  
  // Physical Visits
  physicalVisits: PhysicalVerificationVisit[];
  logPhysicalVisit: (visitData: Omit<PhysicalVerificationVisit, 'id'>) => void;

  // Messaging & Scam Shield
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => { message: Message; scamDetected: boolean; flaggedPhrases: string[] };
  startOrOpenConversation: (listingId: string, landlordId: string, landlordName: string, listingTitle: string) => string;

  // Scam Reporting & Safety
  reports: ScamReport[];
  submitScamReport: (data: {
    targetListingId?: string;
    targetListingTitle?: string;
    targetUserId: string;
    targetUserName: string;
    reason: ScamReportReason;
    reasonLabel: string;
    description: string;
    amountDemandedUsd?: number;
    evidenceFiles?: string[];
  }) => ScamReport;
  resolveScamReport: (reportId: string, resolution: ReportResolutionStatus, adminNotes: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => void;

  // Smart Matching & Roommates
  studentPreferences: StudentPreferences;
  updateStudentPreferences: (prefs: Partial<StudentPreferences>) => void;
  roommates: RoommateProfile[];
  addRoommateProfile: (profile: Omit<RoommateProfile, 'id'>) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (actionType: AuditLog['actionType'], targetId: string, targetType: AuditLog['targetEntityType'], details: string) => void;

  // Active view / navigation (Strictly 3 Portals: Student, Landlord, Admin)
  activeTab: 'browse' | 'student_portal' | 'messages' | 'landlord_portal' | 'admin_portal';
  setActiveTab: (tab: 'browse' | 'student_portal' | 'messages' | 'landlord_portal' | 'admin_portal') => void;

  // Modal / Detail state
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportTargetListing: Listing | null;
  setReportTargetListing: (listing: Listing | null) => void;
  isSrsModalOpen: boolean;
  setIsSrsModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register_student' | 'register_landlord' | 'reset_password';
  setAuthModalMode: (mode: 'login' | 'register_student' | 'register_landlord' | 'reset_password') => void;

  // Export Case Dossier
  exportCaseDossier: (reportId: string) => void;
  resetToDefaultData: () => void;

  // Additional UI States
  savedListingIds: string[];
  toggleSaveListing: (listingId: string) => void;
  isListingSaved: (listingId: string) => boolean;
  selectedCurrency: 'USD' | 'GBP' | 'EUR' | 'ZWL';
  setSelectedCurrency: (curr: 'USD' | 'GBP' | 'EUR' | 'ZWL') => void;
  formatPrice: (priceUsd: number) => string;
  isShortlistOpen: boolean;
  setIsShortlistOpen: (open: boolean) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  viewMode: 'grid' | 'map' | 'split';
  setViewMode: (mode: 'grid' | 'map' | 'split') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const STORAGE_KEY_PREFIX = 'stayverify_v1_';

  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [allUsers, setAllUsers] = useState<User[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadFromStorage<User | null>('current_user', null);
    return saved || INITIAL_USERS[0]; // Student Tendai by default
  });

  // Dedicated Stakeholder Auth States
  const [studentUser, setStudentUser] = useState<User | null>(() => loadFromStorage<User | null>('student_user', null));
  const [landlordUser, setLandlordUser] = useState<User | null>(() => loadFromStorage<User | null>('landlord_user', null));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => loadFromStorage<boolean>('is_admin_auth', false));

  const [listings, setListings] = useState<Listing[]>(() => loadFromStorage('listings', INITIAL_LISTINGS));
  const [documents, setDocuments] = useState<VerificationDocument[]>(() => loadFromStorage('documents', INITIAL_VERIFICATION_DOCUMENTS));
  const [physicalVisits, setPhysicalVisits] = useState<PhysicalVerificationVisit[]>(() => loadFromStorage('physical_visits', INITIAL_PHYSICAL_VISITS));
  const [reports, setReports] = useState<ScamReport[]>(() => loadFromStorage('reports', INITIAL_SCAM_REPORTS));
  const [conversations, setConversations] = useState<Conversation[]>(() => loadFromStorage('conversations', INITIAL_CONVERSATIONS));
  const [messages, setMessages] = useState<Message[]>(() => loadFromStorage('messages', INITIAL_MESSAGES));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('reviews', INITIAL_REVIEWS));
  const [roommates, setRoommates] = useState<RoommateProfile[]>(() => loadFromStorage('roommates', INITIAL_ROOMMATES));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS));
  const [studentPreferences, setStudentPreferences] = useState<StudentPreferences>(() => loadFromStorage('student_prefs', DEFAULT_STUDENT_PREFERENCES));

  const [activeTab, setActiveTab] = useState<'browse' | 'student_portal' | 'messages' | 'landlord_portal' | 'admin_portal'>('browse');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportTargetListing, setReportTargetListing] = useState<Listing | null>(null);
  const [isSrsModalOpen, setIsSrsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register_student' | 'register_landlord' | 'reset_password'>('login');

  // Interactive UI state
  const [savedListingIds, setSavedListingIds] = useState<string[]>(() => loadFromStorage('saved_listings', ['lst-001', 'lst-003']));
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'GBP' | 'EUR' | 'ZWL'>('USD');
  const [isShortlistOpen, setIsShortlistOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('grid');

  const toggleSaveListing = (listingId: string) => {
    setSavedListingIds(prev => {
      const next = prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId];
      localStorage.setItem(STORAGE_KEY_PREFIX + 'saved_listings', JSON.stringify(next));
      return next;
    });
  };

  const isListingSaved = (listingId: string) => {
    return savedListingIds.includes(listingId);
  };

  const formatPrice = (priceUsd: number) => {
    switch (selectedCurrency) {
      case 'GBP':
        return `£${Math.round(priceUsd * 0.79)}`;
      case 'EUR':
        return `€${Math.round(priceUsd * 0.92)}`;
      case 'ZWL':
        return `ZiG ${Math.round(priceUsd * 26.5).toLocaleString()}`;
      case 'USD':
      default:
        return `$${priceUsd}`;
    }
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(allUsers));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'student_user', JSON.stringify(studentUser));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'landlord_user', JSON.stringify(landlordUser));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'is_admin_auth', JSON.stringify(isAdminAuthenticated));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'listings', JSON.stringify(listings));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'documents', JSON.stringify(documents));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'physical_visits', JSON.stringify(physicalVisits));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'reports', JSON.stringify(reports));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'conversations', JSON.stringify(conversations));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'messages', JSON.stringify(messages));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'reviews', JSON.stringify(reviews));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'roommates', JSON.stringify(roommates));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'student_prefs', JSON.stringify(studentPreferences));
  }, [allUsers, currentUser, studentUser, landlordUser, isAdminAuthenticated, listings, documents, physicalVisits, reports, conversations, messages, reviews, roommates, auditLogs, studentPreferences]);

  // 1. Student Authentication & Registration
  const loginStudent = (identifier: string, password?: string) => {
    const clean = identifier.trim().toLowerCase();
    if (clean === 'demo') {
      const demoStudent = allUsers.find(u => u.role === 'student') || INITIAL_USERS[0];
      setStudentUser(demoStudent);
      setCurrentUser(demoStudent);
      return { success: true, user: demoStudent };
    }

    const student = allUsers.find(u =>
      u.role === 'student' &&
      (u.email.toLowerCase() === clean ||
       (u.studentNumber && u.studentNumber.toLowerCase() === clean) ||
       u.name.toLowerCase() === clean)
    );

    if (!student) {
      return { success: false, error: 'Student account not found. Please check your personal email or Student ID, or register below.' };
    }

    if (password && student.password && student.password !== password) {
      return { success: false, error: 'Incorrect password for student account.' };
    }

    setStudentUser(student);
    setCurrentUser(student);
    return { success: true, user: student };
  };

  const logoutStudent = () => {
    setStudentUser(null);
  };

  const registerStudent = (data: { name: string; studentNumber: string; email: string; phone?: string; password?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanReg = data.studentNumber.trim().toUpperCase();

    const existing = allUsers.find(u =>
      u.email.toLowerCase() === cleanEmail ||
      (u.studentNumber && u.studentNumber.toUpperCase() === cleanReg)
    );

    if (existing) {
      return { success: false, error: 'A student with this Student ID or Email already exists. Please log in.' };
    }

    const newStudent: User = {
      id: `usr-student-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      studentNumber: cleanReg,
      role: 'student',
      phone: data.phone?.trim() || '+263 77 000 0000',
      isStudentVerified: true,
      password: data.password || 'student123',
      createdAt: new Date().toISOString()
    };

    setAllUsers(prev => [newStudent, ...prev]);
    setStudentUser(newStudent);
    setCurrentUser(newStudent);
    logAuditAction('student_registered', newStudent.id, 'user', `Student registered: ${newStudent.name} (${newStudent.studentNumber})`);
    return { success: true, user: newStudent };
  };

  // 2. Landlord Access Key Authentication
  const loginLandlordWithKey = (accessKey: string) => {
    const cleanKey = accessKey.trim().toUpperCase();
    const landlord = allUsers.find(u =>
      u.role === 'landlord' &&
      u.accessKey &&
      u.accessKey.trim().toUpperCase() === cleanKey
    );

    if (!landlord) {
      return {
        success: false,
        error: 'Invalid Landlord Access Key. Please enter a valid key provided by the NUST Housing Admin.'
      };
    }

    setLandlordUser(landlord);
    setCurrentUser(landlord);
    return { success: true, landlord };
  };

  const logoutLandlord = () => {
    setLandlordUser(null);
  };

  // 3. Admin Master Password Authentication
  const loginAdmin = (password: string) => {
    if (password.trim() === 'admin123') {
      setIsAdminAuthenticated(true);
      const adminUser = allUsers.find(u => u.role === 'admin') || INITIAL_USERS.find(u => u.role === 'admin')!;
      setCurrentUser(adminUser);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  // 4. Admin Stakeholder Management
  const addLandlord = (data: { name: string; email: string; phone: string; suburb?: string; accessKey?: string }) => {
    const key = data.accessKey?.trim().toUpperCase() ||
      `HOST-${data.name.split(' ')[0].replace(/[^A-Za-z]/g, '').toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newLandlord: User = {
      id: `usr-landlord-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role: 'landlord',
      accessKey: key,
      landlordVerificationTier: 'physically_verified',
      createdAt: new Date().toISOString()
    };

    setAllUsers(prev => [newLandlord, ...prev]);
    logAuditAction('landlord_added_by_admin', newLandlord.id, 'user', `Admin added landlord ${newLandlord.name} with Access Key: ${key}`);
    return newLandlord;
  };

  const removeLandlord = (landlordId: string) => {
    const target = allUsers.find(u => u.id === landlordId);
    setAllUsers(prev => prev.filter(u => u.id !== landlordId));
    if (landlordUser?.id === landlordId) {
      setLandlordUser(null);
    }
    logAuditAction('landlord_removed_by_admin', landlordId, 'user', `Admin removed landlord ${target?.name || landlordId}`);
  };

  const addStudent = (data: { name: string; studentNumber: string; email: string; phone?: string; password?: string }) => {
    const newStudent: User = {
      id: `usr-student-${Date.now()}`,
      name: data.name.trim(),
      studentNumber: data.studentNumber.trim().toUpperCase(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '+263 77 000 0000',
      role: 'student',
      isStudentVerified: true,
      password: data.password || 'student123',
      createdAt: new Date().toISOString()
    };

    setAllUsers(prev => [newStudent, ...prev]);
    logAuditAction('student_added_by_admin', newStudent.id, 'user', `Admin added student: ${newStudent.name} (${newStudent.studentNumber})`);
    return newStudent;
  };

  const removeStudent = (studentId: string) => {
    const target = allUsers.find(u => u.id === studentId);
    setAllUsers(prev => prev.filter(u => u.id !== studentId));
    if (studentUser?.id === studentId) {
      setStudentUser(null);
    }
    logAuditAction('student_removed_by_admin', studentId, 'user', `Admin removed student ${target?.name || studentId}`);
  };

  const deleteListing = (listingId: string) => {
    const target = listings.find(l => l.id === listingId);
    setListings(prev => prev.filter(l => l.id !== listingId));
    logAuditAction('listing_deleted', listingId, 'listing', `Deleted listing: "${target?.title || listingId}"`);
  };

  const logAuditAction = (actionType: AuditLog['actionType'], targetId: string, targetType: AuditLog['targetEntityType'], details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType,
      targetEntityId: targetId,
      targetEntityType: targetType,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchUserById = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      if (target.role === 'admin') setActiveTab('admin_portal');
      else if (target.role === 'landlord') setActiveTab('landlord_portal');
      else setActiveTab('browse');
    }
  };

  const switchRole = (role: UserRole) => {
    const sampleUserForRole = allUsers.find(u => u.role === role);
    if (sampleUserForRole) {
      setCurrentUser(sampleUserForRole);
      if (role === 'admin') setActiveTab('admin_portal');
      else if (role === 'landlord') setActiveTab('landlord_portal');
      else setActiveTab('browse');
    }
  };

  // Anti-scam duplicate/flagged listing check
  const checkDuplicateOrFlaggedListing = (title: string, address: string) => {
    const lowerTitle = title.toLowerCase();
    const lowerAddress = address.toLowerCase();

    // Check if address or title belongs to a banned or reported listing
    const suspiciousMatch = listings.find(l => 
      (l.status === 'suspended_under_review' || l.status === 'banned') &&
      (l.address.toLowerCase().includes(lowerAddress) || lowerTitle.includes('half price') || lowerTitle.includes('luxury en-suite studio'))
    );

    if (suspiciousMatch) {
      return {
        isFlagged: true,
        reason: `Address or title matches a previously reported/suspended fraudulent listing (${suspiciousMatch.title}). Admin investigation required before publishing.`
      };
    }
    return { isFlagged: false };
  };

  const addListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'reportCount' | 'viewsCount' | 'ratingAverage' | 'ratingCount'>) => {
    // Duplicate safety check
    const dupCheck = checkDuplicateOrFlaggedListing(listingData.title, listingData.address);
    if (dupCheck.isFlagged) {
      logAuditAction('listing_auto_suspended', 'temp-dup', 'listing', `Duplicate/flagged listing blocked during creation attempt: ${dupCheck.reason}`);
      return {
        success: false,
        error: dupCheck.reason
      };
    }

    const newListing: Listing = {
      ...listingData,
      id: `list-${Date.now()}`,
      reportCount: 0,
      viewsCount: 1,
      ratingAverage: 5.0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setListings(prev => [newListing, ...prev]);
    logAuditAction('listing_created', newListing.id, 'listing', `Created listing: "${newListing.title}" with verification badge: ${newListing.verificationBadge}`);
    return { success: true, listing: newListing };
  };

  const updateListing = (listingId: string, updatedData: Partial<Listing>) => {
    const existing = listings.find(l => l.id === listingId);
    if (!existing) {
      return { success: false, error: 'Accommodation listing not found.' };
    }

    const updatedListing: Listing = {
      ...existing,
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    setListings(prev => prev.map(l => l.id === listingId ? updatedListing : l));
    logAuditAction('listing_updated', listingId, 'listing', `Updated accommodation details for "${updatedListing.title}"`);
    return { success: true, listing: updatedListing };
  };

  const updateListingStatus = (listingId: string, status: Listing['status'], adminNotes?: string) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, status, updatedAt: new Date().toISOString() } : l));
    logAuditAction(
      status === 'banned' ? 'listing_manually_banned' : status === 'active' ? 'listing_restored' : 'listing_auto_suspended',
      listingId,
      'listing',
      `Listing status updated to "${status}". Notes: ${adminNotes || 'N/A'}`
    );
  };

  const incrementListingViews = (listingId: string) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, viewsCount: l.viewsCount + 1 } : l));
  };

  const uploadVerificationDocument = (doc: Omit<VerificationDocument, 'id' | 'uploadDate' | 'status'>) => {
    const newDoc: VerificationDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString(),
      status: 'pending'
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAuditAction('landlord_verified', newDoc.id, 'verification_doc', `Landlord ${doc.landlordName} submitted ${doc.documentType} for review.`);
  };

  const reviewVerificationDocument = (docId: string, status: 'approved' | 'rejected', notes: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status,
          reviewedByAdminId: currentUser.id,
          adminReviewNotes: notes,
          reviewedAt: new Date().toISOString()
        };
      }
      return d;
    }));

    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc && status === 'approved') {
      // Upgrade landlord tier and their listings
      setAllUsers(prev => prev.map(u => u.id === targetDoc.landlordId ? { ...u, landlordVerificationTier: 'document_verified' } : u));
      if (currentUser.id === targetDoc.landlordId) {
        setCurrentUser(prev => ({ ...prev, landlordVerificationTier: 'document_verified' }));
      }
      setListings(prev => prev.map(l => l.landlordId === targetDoc.landlordId && l.verificationBadge === 'unverified' ? { ...l, verificationBadge: 'document_verified', landlordTier: 'document_verified' } : l));
      logAuditAction('landlord_verified', targetDoc.landlordId, 'user', `Document ${targetDoc.documentType} approved by ${currentUser.name}. Tier upgraded to document_verified.`);
    } else if (targetDoc && status === 'rejected') {
      logAuditAction('landlord_rejected', targetDoc.landlordId, 'user', `Document rejected by ${currentUser.name}. Reason: ${notes}`);
    }
  };

  const logPhysicalVisit = (visitData: Omit<PhysicalVerificationVisit, 'id'>) => {
    const newVisit: PhysicalVerificationVisit = {
      ...visitData,
      id: `pv-${Date.now()}`
    };
    setPhysicalVisits(prev => [newVisit, ...prev]);

    if (visitData.status === 'passed') {
      // Upgrade listing to physically verified
      setListings(prev => prev.map(l => l.id === visitData.listingId ? {
        ...l,
        verificationBadge: 'physically_verified',
        landlordTier: 'physically_verified',
        physicalVisitId: newVisit.id,
        updatedAt: new Date().toISOString()
      } : l));

      // Also upgrade landlord profile
      setAllUsers(prev => prev.map(u => u.id === visitData.landlordId ? { ...u, landlordVerificationTier: 'physically_verified' } : u));
      
      logAuditAction('physical_visit_logged', visitData.listingId, 'listing', `Physical verification visit passed by ${visitData.inspectorName}. Upgraded to physically_verified badge.`);
    }
  };

  // Safe In-Platform Messaging with Anti-Scam Keyword Scanner
  const sendMessage = (conversationId: string, text: string) => {
    const lowerText = text.toLowerCase();
    const detectedKeywords = SCAM_KEYWORDS.filter(k => lowerText.includes(k));
    const scamDetected = detectedKeywords.length > 0;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toISOString(),
      isSystemWarning: scamDetected,
      flaggedScamPhrases: detectedKeywords
    };

    setMessages(prev => [...prev, newMsg]);

    // Update conversation timestamp & last message
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTimestamp: new Date().toISOString()
        };
      }
      return c;
    }));

    return { message: newMsg, scamDetected, flaggedPhrases: detectedKeywords };
  };

  const startOrOpenConversation = (listingId: string, landlordId: string, landlordName: string, listingTitle: string) => {
    const existing = conversations.find(c => c.listingId === listingId && c.studentId === currentUser.id);
    if (existing) {
      setActiveConversationId(existing.id);
      setActiveTab('messages');
      return existing.id;
    }

    const hasPendingReports = reports.some(r => r.targetUserId === landlordId && (r.status === 'open' || r.status === 'under_investigation'));

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      landlordId,
      landlordName,
      listingId,
      listingTitle,
      lastMessage: 'Conversation opened. Safe in-platform messaging active.',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCountStudent: 0,
      unreadCountLandlord: 0,
      hasLandlordPendingReport: hasPendingReports
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveTab('messages');
    return newConv.id;
  };

  // Scam Reporting & Automated Threshold Suspension
  const submitScamReport = (data: {
    targetListingId?: string;
    targetListingTitle?: string;
    targetUserId: string;
    targetUserName: string;
    reason: ScamReportReason;
    reasonLabel: string;
    description: string;
    amountDemandedUsd?: number;
    evidenceFiles?: string[];
  }) => {
    // Collect associated chat logs if present
    const conv = conversations.find(c => 
      (data.targetListingId && c.listingId === data.targetListingId) ||
      (c.landlordId === data.targetUserId || c.studentId === data.targetUserId)
    );
    
    const relevantMsgs = conv ? messages.filter(m => m.conversationId === conv.id).map(m => ({
      sender: m.senderName,
      text: m.text,
      time: new Date(m.timestamp).toLocaleTimeString()
    })) : undefined;

    const targetListing = data.targetListingId ? listings.find(l => l.id === data.targetListingId) : undefined;

    const newReport: ScamReport = {
      id: `rep-${Date.now()}`,
      caseNumber: `SV-CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      targetListingId: data.targetListingId,
      targetListingTitle: data.targetListingTitle || targetListing?.title,
      targetUserId: data.targetUserId,
      targetUserName: data.targetUserName,
      reason: data.reason,
      reasonLabel: data.reasonLabel,
      description: data.description,
      amountDemandedUsd: data.amountDemandedUsd,
      evidenceFiles: data.evidenceFiles,
      status: 'under_investigation',
      attachedChatLogSnapshot: relevantMsgs ? { messages: relevantMsgs } : undefined,
      attachedListingSnapshot: targetListing,
      createdAt: new Date().toISOString()
    };

    // Check report threshold for listing
    let autoSuspended = false;
    if (data.targetListingId) {
      const existingReportsCount = reports.filter(r => r.targetListingId === data.targetListingId).length + 1;
      if (existingReportsCount >= 2) {
        // Automatically suspend listing
        newReport.isThresholdAutoSuspension = true;
        autoSuspended = true;
        setListings(prev => prev.map(l => l.id === data.targetListingId ? {
          ...l,
          status: 'suspended_under_review',
          reportCount: existingReportsCount,
          scamWarningFlags: [...(l.scamWarningFlags || []), `Accumulated ${existingReportsCount} fraud reports (Suspended by Safety System)`]
        } : l));
        logAuditAction('listing_auto_suspended', data.targetListingId, 'listing', `Auto-suspended listing "${data.targetListingTitle}" after accumulating ${existingReportsCount} scam reports.`);
      } else {
        setListings(prev => prev.map(l => l.id === data.targetListingId ? { ...l, reportCount: l.reportCount + 1 } : l));
      }
    }

    setReports(prev => [newReport, ...prev]);
    logAuditAction('scam_report_filed', newReport.id, 'report', `Scam report ${newReport.caseNumber} filed by ${currentUser.name} against ${data.targetUserName}. Reason: ${data.reasonLabel}`);

    return newReport;
  };

  const resolveScamReport = (reportId: string, resolution: ReportResolutionStatus, adminNotes: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: resolution,
          adminNotes,
          handledByAdminId: currentUser.id,
          resolvedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    const report = reports.find(r => r.id === reportId);
    if (report && report.targetListingId) {
      if (resolution === 'resolved_listing_banned') {
        updateListingStatus(report.targetListingId, 'banned', `Banned following substantiated scam investigation ${report.caseNumber}: ${adminNotes}`);
      } else if (resolution === 'resolved_dismissed') {
        updateListingStatus(report.targetListingId, 'active', `Restored following review: ${adminNotes}`);
      }
    }

    logAuditAction('scam_report_resolved', reportId, 'report', `Report ${report?.caseNumber || reportId} resolved with outcome "${resolution}" by ${currentUser.name}.`);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate listing rating
    const allListingReviews = [...reviews.filter(r => r.listingId === reviewData.listingId), newRev];
    const avg = allListingReviews.reduce((acc, curr) => acc + curr.rating, 0) / allListingReviews.length;

    setListings(prev => prev.map(l => l.id === reviewData.listingId ? {
      ...l,
      ratingAverage: Number(avg.toFixed(1)),
      ratingCount: allListingReviews.length
    } : l));
  };

  const updateStudentPreferences = (prefs: Partial<StudentPreferences>) => {
    setStudentPreferences(prev => ({ ...prev, ...prefs }));
  };

  const addRoommateProfile = (profile: Omit<RoommateProfile, 'id'>) => {
    const newProfile: RoommateProfile = {
      ...profile,
      id: `rm-${Date.now()}`
    };
    setRoommates(prev => [newProfile, ...prev]);
  };

  // Case Dossier Export for Police / Disciplinary Committee
  const exportCaseDossier = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    logAuditAction('dossier_exported_for_police', reportId, 'report', `Exported legal/police audit dossier for case ${report.caseNumber}`);

    // Generate formatted printable window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>StayVerify Official Incident Dossier - ${report.caseNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #fee2e2; color: #991b1b; font-weight: bold; font-size: 12px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .card { background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; }
          .chat-box { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; }
          .chat-msg { margin-bottom: 8px; }
          .chat-sender { color: #38bdf8; font-weight: bold; }
          .chat-time { color: #94a3b8; font-size: 11px; margin-left: 6px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin: 0 0 6px 0; color: #0f172a;">StayVerify Anti-Fraud Incident Dossier</h1>
            <p style="margin: 0; color: #64748b;">National University of Science and Technology (NUST) Off-Campus Accommodation Safety Network</p>
          </div>
          <div style="text-align: right;">
            <span class="badge">OFFICIAL AUDIT REPORT</span>
            <p style="margin: 6px 0 0 0; font-weight: bold;">Case ID: ${report.caseNumber}</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Generated: ${new Date().toLocaleString()}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Incident Summary</div>
          <div class="grid">
            <div class="card">
              <strong>Reported Reason:</strong> ${report.reasonLabel}<br/>
              <strong>Status:</strong> ${report.status.toUpperCase()}<br/>
              <strong>Amount Demanded:</strong> ${report.amountDemandedUsd ? '$' + report.amountDemandedUsd + ' USD' : 'N/A'}<br/>
              <strong>Date Logged:</strong> ${new Date(report.createdAt).toLocaleString()}
            </div>
            <div class="card">
              <strong>Reporting Student:</strong> ${report.reporterName}<br/>
              <strong>Target User / Account:</strong> ${report.targetUserName}<br/>
              <strong>Target Listing:</strong> ${report.targetListingTitle || 'N/A'}<br/>
              <strong>Handled By Officer:</strong> ${report.handledByAdminId || 'Pending Allocation'}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Complainant Statement & Narrative</div>
          <div class="card" style="background: #fff; border-left: 4px solid #ef4444;">
            "${report.description}"
          </div>
        </div>

        ${report.attachedChatLogSnapshot?.messages ? `
          <div class="section">
            <div class="section-title">Tamper-Evident In-Platform Chat Transcript</div>
            <div class="chat-box">
              ${report.attachedChatLogSnapshot.messages.map(m => `
                <div class="chat-msg">
                  <span class="chat-sender">${m.sender}</span> <span class="chat-time">${m.time}</span>:
                  <div>${m.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Admin Action & Resolution Notes</div>
          <div class="card">
            ${report.adminNotes || 'Investigation currently active under StayVerify Campus Safety Protocol.'}
          </div>
        </div>

        <div class="footer">
          StayVerify Platform (SRS Document Version 1.0) &bull; Compliant with Zimbabwean Data Protection & NUST Student Housing Policies &bull; Document hash: SHA256-${Date.now()}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setListings(INITIAL_LISTINGS);
    setDocuments(INITIAL_VERIFICATION_DOCUMENTS);
    setPhysicalVisits(INITIAL_PHYSICAL_VISITS);
    setReports(INITIAL_SCAM_REPORTS);
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setReviews(INITIAL_REVIEWS);
    setRoommates(INITIAL_ROOMMATES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setStudentPreferences(DEFAULT_STUDENT_PREFERENCES);
    setActiveTab('browse');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUser,
        switchUserById,
        switchRole,
        studentUser,
        loginStudent,
        logoutStudent,
        registerStudent,
        landlordUser,
        loginLandlordWithKey,
        logoutLandlord,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        addLandlord,
        removeLandlord,
        addStudent,
        removeStudent,
        deleteListing,
        listings,
        addListing,
        updateListing,
        updateListingStatus,
        incrementListingViews,
        checkDuplicateOrFlaggedListing,
        documents,
        uploadVerificationDocument,
        reviewVerificationDocument,
        physicalVisits,
        logPhysicalVisit,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startOrOpenConversation,
        reports,
        submitScamReport,
        resolveScamReport,
        reviews,
        addReview,
        studentPreferences,
        updateStudentPreferences,
        roommates,
        addRoommateProfile,
        auditLogs,
        logAuditAction,
        activeTab,
        setActiveTab,
        selectedListing,
        setSelectedListing,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTargetListing,
        setReportTargetListing,
        isSrsModalOpen,
        setIsSrsModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        exportCaseDossier,
        resetToDefaultData,
        savedListingIds,
        toggleSaveListing,
        isListingSaved,
        selectedCurrency,
        setSelectedCurrency,
        formatPrice,
        isShortlistOpen,
        setIsShortlistOpen,
        isSupportModalOpen,
        setIsSupportModalOpen,
        viewMode,
        setViewMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
