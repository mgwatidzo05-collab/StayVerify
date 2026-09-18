import {
  User,
  Listing,
  VerificationDocument,
  PhysicalVerificationVisit,
  ScamReport,
  Message,
  Conversation,
  Review,
  AuditLog,
  RoommateProfile,
  StudentPreferences
} from '../types';

export const SCAM_KEYWORDS = [
  'pay before viewing',
  'send ecocash',
  'pay deposit first',
  'wire money',
  'western union',
  'booking fee to reserve',
  'i am out of town but pay',
  'send money before you see',
  'whatsapp payment',
  'cash app only',
  'reserve room now before it goes',
  'viewing fee',
  'advance fee',
  'holding fee'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-1',
    name: 'Tendai Moyo',
    email: 'tendai.moyo@students.nust.ac.zw',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentNumber: 'N0234819P',
    institution: 'National University of Science & Technology (NUST)',
    isStudentVerified: true,
    password: 'student123',
    phone: '+263 77 234 5678',
    isPhoneVisibleToMatch: false,
    createdAt: '2026-02-10T08:30:00Z'
  },
  {
    id: 'usr-student-2',
    name: 'Thabo Ncube',
    email: 'thabo.ncube@students.nust.ac.zw',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    studentNumber: 'N0231920K',
    institution: 'National University of Science & Technology (NUST)',
    isStudentVerified: true,
    password: 'student123',
    phone: '+263 77 555 8899',
    isPhoneVisibleToMatch: false,
    createdAt: '2026-02-12T09:15:00Z'
  },
  {
    id: 'usr-landlord-1',
    name: 'Mr. Simbarashe Sibanda',
    email: 's.sibanda.properties@gmail.com',
    role: 'landlord',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+263 71 890 1234',
    isPhoneVisibleToMatch: true,
    accessKey: 'HOST-SIBANDA-77',
    landlordVerificationTier: 'physically_verified',
    createdAt: '2025-11-15T10:00:00Z'
  },
  {
    id: 'usr-landlord-2',
    name: 'Mrs. Nomsa Khumalo',
    email: 'khumalo.cottages@gmail.com',
    role: 'landlord',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+263 77 445 6789',
    isPhoneVisibleToMatch: false,
    accessKey: 'HOST-KHUMALO-42',
    landlordVerificationTier: 'document_verified',
    createdAt: '2026-01-05T14:20:00Z'
  },
  {
    id: 'usr-landlord-unverified',
    name: 'Prince "Realtor" Gumbo (Unverified)',
    email: 'fastdeals.housing@ymail.com',
    role: 'landlord',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+263 78 999 0000',
    isPhoneVisibleToMatch: false,
    accessKey: 'HOST-GUMBO-99',
    landlordVerificationTier: 'unverified',
    createdAt: '2026-08-20T11:00:00Z'
  },
  {
    id: 'usr-admin-1',
    name: 'Chipo Marere (Safety Officer)',
    email: 'chipo.marere@stayverify.org',
    role: 'admin',
    password: 'admin123',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-08-01T09:00:00Z'
  },
  {
    id: 'usr-housing-officer-1',
    name: 'Dr. E. Ndlovu (NUST Housing Liaison)',
    email: 'dean.students@nust.ac.zw',
    role: 'housing_office',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    institution: 'NUST Department of Student Affairs',
    createdAt: '2025-09-01T09:00:00Z'
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'list-101',
    landlordId: 'usr-landlord-1',
    landlordName: 'Mr. Simbarashe Sibanda',
    landlordEmail: 's.sibanda.properties@gmail.com',
    landlordPhone: '+263 71 890 1234',
    landlordTier: 'physically_verified',
    title: 'Executive Student Cottage with Solar & Borehole (Riverside)',
    description: 'Fully furnished, high-security self-contained cottage strictly for university students. 24-hour solar backup power (run laptops & lights 24/7 during load shedding), uninterrupted borehole pressurized water, high-speed fiber internet, and dedicated study desks.',
    address: '14 Jacaranda Crescent, Riverside',
    googleMapUrl: 'https://maps.google.com/?q=-20.1772,28.6385',
    suburb: 'Riverside',
    distanceToCampusKm: 0.9,
    walkingMinutes: 11,
    pricePerMonthUsd: 120,
    depositRequiredUsd: 50,
    depositPolicy: 'Zero deposit before physical in-person viewing. Deposit paid only upon signing key handover checklist.',
    roomType: 'two_sharing',
    totalRooms: 4,
    availableSpots: 2,
    genderPreference: 'any',
    amenities: ['Solar Power (24/7)', 'Borehole Water', 'Fiber Wi-Fi', 'Electric Fence & Guard', 'Washing Machine', 'Study Desks', 'Gas Stove'],
    verificationBadge: 'physically_verified',
    physicalVisitId: 'pv-001',
    status: 'active',
    reportCount: 0,
    viewsCount: 428,
    createdAt: '2026-07-15T10:00:00Z',
    updatedAt: '2026-08-20T14:30:00Z',
    ratingAverage: 4.9,
    ratingCount: 14,
    media: [
      {
        id: 'med-101-1',
        url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
        caption: 'Bedroom interior with dual ergonomic study desks',
        timestamp: '2026-08-18 14:22:10 UTC (Verified EXIF)',
        cameraMetadataVerified: true,
        isOriginalChecked: true
      },
      {
        id: 'med-101-2',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
        caption: 'Shared communal study area and kitchenette',
        timestamp: '2026-08-18 14:25:40 UTC (Verified EXIF)',
        cameraMetadataVerified: true,
        isOriginalChecked: true
      },
      {
        id: 'med-101-3',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        caption: 'Modern tiled bathroom with solar geyser hot water',
        timestamp: '2026-08-18 14:28:15 UTC (Verified EXIF)',
        cameraMetadataVerified: true,
        isOriginalChecked: true
      }
    ]
  },
  {
    id: 'list-102',
    landlordId: 'usr-landlord-2',
    landlordName: 'Mrs. Nomsa Khumalo',
    landlordEmail: 'khumalo.cottages@gmail.com',
    landlordPhone: '+263 77 445 6789',
    landlordTier: 'document_verified',
    title: 'Spacious Single Room in Secure Gated Compound (Selborne Park)',
    description: 'Quiet study-oriented household near NUST back gate. Single private room with built-in cupboards. Solar lighting, shared modern kitchen, constant borehole water, and strict quiet study hours between 8 PM - 6 AM.',
    address: '42 Mahogany Avenue, Selborne Park',
    googleMapUrl: 'https://maps.google.com/?q=-20.1715,28.6432',
    suburb: 'Selborne Park',
    distanceToCampusKm: 1.4,
    walkingMinutes: 16,
    pricePerMonthUsd: 140,
    depositRequiredUsd: 70,
    depositPolicy: 'Physical walk-through required. Deposit held under StayVerify tenancy confirmation.',
    roomType: 'single',
    totalRooms: 3,
    availableSpots: 1,
    genderPreference: 'female_only',
    amenities: ['Solar Lighting', 'Borehole Water', 'Wi-Fi Included', 'Perimeter Alarm', 'Kitchen Access', 'Fitted Wardrobe'],
    verificationBadge: 'document_verified',
    status: 'active',
    reportCount: 0,
    viewsCount: 310,
    createdAt: '2026-08-01T09:15:00Z',
    updatedAt: '2026-08-22T11:00:00Z',
    ratingAverage: 4.7,
    ratingCount: 8,
    media: [
      {
        id: 'med-102-1',
        url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80',
        caption: 'Single room setup with window overlooking garden',
        timestamp: '2026-08-01 10:14:02 UTC (Verified EXIF)',
        cameraMetadataVerified: true,
        isOriginalChecked: true
      },
      {
        id: 'med-102-2',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
        caption: 'Fitted kitchen with gas backup stove',
        timestamp: '2026-08-01 10:18:22 UTC (Verified EXIF)',
        cameraMetadataVerified: true,
        isOriginalChecked: true
      }
    ]
  },
  {
    id: 'list-103',
    landlordId: 'usr-landlord-1',
    landlordName: 'Mr. Simbarashe Sibanda',
    landlordEmail: 's.sibanda.properties@gmail.com',
    landlordPhone: '+263 71 890 1234',
    landlordTier: 'physically_verified',
    title: 'Budget-Friendly 4-Sharing Wing with High-Speed Wi-Fi (Woodlands)',
    description: 'Affordable, fully serviced student wing ideal for budget-conscious students. 5kVA Solar system, borehole, clean double bunk beds with orthopedic mattresses, hot showers, and daily common-area cleaning.',
    address: '8 Palm Way, Woodlands',
    googleMapUrl: 'https://maps.google.com/?q=-20.1690,28.6310',
    suburb: 'Woodlands',
    distanceToCampusKm: 2.1,
    walkingMinutes: 24,
    pricePerMonthUsd: 70,
    depositRequiredUsd: 30,
    depositPolicy: 'Pay deposit only after you have inspected the property in person.',
    roomType: 'four_sharing',
    totalRooms: 6,
    availableSpots: 3,
    genderPreference: 'male_only',
    amenities: ['Solar Power (24/7)', 'Borehole Water', 'Free Fiber Wi-Fi', 'Security Guard', 'Daily Cleaning', 'Recreational Yard'],
    verificationBadge: 'physically_verified',
    physicalVisitId: 'pv-002',
    status: 'active',
    reportCount: 0,
    viewsCount: 512,
    createdAt: '2026-07-28T16:00:00Z',
    updatedAt: '2026-08-24T08:00:00Z',
    ratingAverage: 4.6,
    ratingCount: 19,
    media: [
      {
        id: 'med-103-1',
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
        caption: 'Spacious shared student bedroom',
        timestamp: '2026-07-28 11:30:19 UTC (Verified EXIF)',
        cameraMetadataVerified: true,
        isOriginalChecked: true
      }
    ]
  },
  {
    id: 'list-104-suspicious',
    landlordId: 'usr-landlord-unverified',
    landlordName: 'Prince "Realtor" Gumbo (Unverified)',
    landlordEmail: 'fastdeals.housing@ymail.com',
    landlordPhone: '+263 78 999 0000',
    landlordTier: 'unverified',
    title: 'LUXURY EN-SUITE STUDIO APARTMENT - HALF PRICE DEAL (SUSPENDED)',
    description: 'Immediate luxury apartment close to campus gate. Fully air-conditioned, huge TV, pool access. Must pay $80 advance booking fee via mobile money immediately to hold keys as many students are competing.',
    address: '99 Mystery Drive, Matsheumhlope',
    suburb: 'Matsheumhlope',
    distanceToCampusKm: 0.5,
    walkingMinutes: 6,
    pricePerMonthUsd: 50,
    depositRequiredUsd: 80,
    depositPolicy: 'Send EcoCash booking fee before any viewing to secure slot.',
    roomType: 'studio',
    totalRooms: 1,
    availableSpots: 1,
    genderPreference: 'any',
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Cable TV'],
    verificationBadge: 'unverified',
    status: 'suspended_under_review',
    reportCount: 3,
    viewsCount: 89,
    scamWarningFlags: [
      'Advance payment demanded before viewing (Known Scam Pattern)',
      'Multiple student fraud reports filed (Suspended by Safety System)',
      'Stock photos detected with inconsistent metadata'
    ],
    createdAt: '2026-08-23T12:00:00Z',
    updatedAt: '2026-08-24T09:40:00Z',
    ratingAverage: 1.0,
    ratingCount: 2,
    media: [
      {
        id: 'med-104-1',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
        caption: 'Downloaded stock image of luxury penthouse (Flagged)',
        timestamp: 'Unavailable / Metadata Stripped',
        cameraMetadataVerified: false,
        isOriginalChecked: false
      }
    ]
  }
];

export const INITIAL_VERIFICATION_DOCUMENTS: VerificationDocument[] = [
  {
    id: 'doc-001',
    landlordId: 'usr-landlord-1',
    landlordName: 'Mr. Simbarashe Sibanda',
    documentType: 'title_deed',
    documentNumber: 'DEED-BYO-2018-9941',
    fileUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=80',
    fileName: 'Title_Deed_14_Jacaranda_Riverside.pdf',
    uploadDate: '2025-11-15T11:00:00Z',
    status: 'approved',
    reviewedByAdminId: 'usr-admin-1',
    adminReviewNotes: 'Title deed matches Bulawayo Deeds Registry records and ID document of owner.',
    reviewedAt: '2025-11-16T14:00:00Z'
  },
  {
    id: 'doc-002',
    landlordId: 'usr-landlord-2',
    landlordName: 'Mrs. Nomsa Khumalo',
    documentType: 'council_rates',
    documentNumber: 'BCC-RATES-2026-4421',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    fileName: 'City_Council_Rates_Bill_SelbornePark.pdf',
    uploadDate: '2026-01-05T14:30:00Z',
    status: 'approved',
    reviewedByAdminId: 'usr-admin-1',
    adminReviewNotes: 'Bulawayo City Council municipal bill confirmed with matching address and applicant name.',
    reviewedAt: '2026-01-06T09:00:00Z'
  },
  {
    id: 'doc-003-pending',
    landlordId: 'usr-landlord-unverified',
    landlordName: 'Prince "Realtor" Gumbo (Unverified)',
    documentType: 'agency_mandate',
    documentNumber: 'MANDATE-PENDING-09',
    fileUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500&auto=format&fit=crop&q=80',
    fileName: 'Generic_WhatsApp_Letter_Mandate.jpg',
    uploadDate: '2026-08-21T10:00:00Z',
    status: 'pending',
    adminReviewNotes: 'Low resolution handwritten letter; no official agency stamp or registered company number.'
  }
];

export const INITIAL_PHYSICAL_VISITS: PhysicalVerificationVisit[] = [
  {
    id: 'pv-001',
    listingId: 'list-101',
    listingTitle: 'Executive Student Cottage with Solar & Borehole (Riverside)',
    landlordId: 'usr-landlord-1',
    inspectorName: 'T. Sibindi (Senior Housing Officer, NUST)',
    inspectorId: 'HO-NUST-04',
    visitDate: '2026-08-19',
    status: 'passed',
    findings: 'Physical inspection completed. High perimeter wall with working electric fence. Solar 5kVA system verified operational. Borehole water pressure test passed. Clean spacious study environment.',
    securityCheckPassed: true,
    waterBackupVerified: true,
    electricityVerified: true,
    amenitiesMatchListing: true,
    approvedBadgeTier: 'physically_verified'
  },
  {
    id: 'pv-002',
    listingId: 'list-103',
    listingTitle: 'Budget-Friendly 4-Sharing Wing with High-Speed Wi-Fi (Woodlands)',
    landlordId: 'usr-landlord-1',
    inspectorName: 'T. Sibindi (Senior Housing Officer, NUST)',
    inspectorId: 'HO-NUST-04',
    visitDate: '2026-08-20',
    status: 'passed',
    findings: 'Verified room dimensions, ventilation, and fire safety exits. Verified guard on site 6pm-6am. Recommended minor lock replacement on side gate which landlord completed on the spot.',
    securityCheckPassed: true,
    waterBackupVerified: true,
    electricityVerified: true,
    amenitiesMatchListing: true,
    approvedBadgeTier: 'physically_verified'
  }
];

export const INITIAL_SCAM_REPORTS: ScamReport[] = [
  {
    id: 'rep-901',
    caseNumber: 'SV-CASE-2026-089',
    reporterId: 'usr-student-1',
    reporterName: 'Tendai Moyo (Student)',
    reporterRole: 'student',
    targetListingId: 'list-104-suspicious',
    targetListingTitle: 'LUXURY EN-SUITE STUDIO APARTMENT - HALF PRICE DEAL',
    targetUserId: 'usr-landlord-unverified',
    targetUserName: 'Prince "Realtor" Gumbo',
    reason: 'advance_deposit_before_viewing',
    reasonLabel: 'Requested deposit / booking fee before physical viewing',
    description: 'The user sent a message saying he is currently in Harare for a funeral and demanded I send $40 via EcoCash to reserve the keys for viewing tomorrow, threatening that 5 other students were on the waitlist.',
    amountDemandedUsd: 40,
    status: 'under_investigation',
    isThresholdAutoSuspension: true,
    createdAt: '2026-08-24T08:15:00Z',
    attachedChatLogSnapshot: {
      messages: [
        { sender: 'Prince "Realtor" Gumbo', text: 'If you want this studio you must pay deposit first $40 EcoCash now before 2pm or I give it to another student.', time: '08:10 AM' },
        { sender: 'Tendai Moyo', text: 'Can I please come with my brother to view it physically first at Jacaranda drive?', time: '08:12 AM' },
        { sender: 'Prince "Realtor" Gumbo', text: 'No viewings without booking fee to reserve keys. Send money before you see.', time: '08:14 AM' }
      ]
    }
  },
  {
    id: 'rep-902',
    caseNumber: 'SV-CASE-2026-088',
    reporterId: 'usr-student-2',
    reporterName: 'Kudakwashe Dube (Student)',
    reporterRole: 'student',
    targetListingId: 'list-104-suspicious',
    targetListingTitle: 'LUXURY EN-SUITE STUDIO APARTMENT - HALF PRICE DEAL',
    targetUserId: 'usr-landlord-unverified',
    targetUserName: 'Prince "Realtor" Gumbo',
    reason: 'fake_photos_or_stolen_listing',
    reasonLabel: 'Fake stock photos stolen from international Airbnb listing',
    description: 'Reverse image search on Google shows these pictures are from an apartment in Cape Town, South Africa, not Matsheumhlope Bulawayo.',
    status: 'under_investigation',
    isThresholdAutoSuspension: true,
    createdAt: '2026-08-24T09:30:00Z'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-01',
    studentId: 'usr-student-1',
    studentName: 'Tendai Moyo',
    landlordId: 'usr-landlord-1',
    landlordName: 'Mr. Simbarashe Sibanda',
    listingId: 'list-101',
    listingTitle: 'Executive Student Cottage with Solar & Borehole (Riverside)',
    lastMessage: 'Good day Mr. Sibanda, is it possible to view the room tomorrow at 3 PM after my lecture at NUST?',
    lastMessageTimestamp: '2026-08-25T10:15:00Z',
    unreadCountStudent: 0,
    unreadCountLandlord: 1,
    hasLandlordPendingReport: false
  },
  {
    id: 'conv-02-scam-demo',
    studentId: 'usr-student-1',
    studentName: 'Tendai Moyo',
    landlordId: 'usr-landlord-unverified',
    landlordName: 'Prince "Realtor" Gumbo (Unverified)',
    listingId: 'list-104-suspicious',
    listingTitle: 'LUXURY EN-SUITE STUDIO APARTMENT - HALF PRICE DEAL (SUSPENDED)',
    lastMessage: 'No viewings without booking fee to reserve keys. Send money before you see.',
    lastMessageTimestamp: '2026-08-24T08:14:00Z',
    unreadCountStudent: 1,
    unreadCountLandlord: 0,
    hasLandlordPendingReport: true
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-01',
    conversationId: 'conv-01',
    senderId: 'usr-student-1',
    senderName: 'Tendai Moyo',
    senderRole: 'student',
    text: 'Good day Mr. Sibanda, I saw your physically-verified listing in Riverside. Does the rent include uncapped fiber Wi-Fi for academic research?',
    timestamp: '2026-08-25T09:40:00Z'
  },
  {
    id: 'msg-02',
    conversationId: 'conv-01',
    senderId: 'usr-landlord-1',
    senderName: 'Mr. Simbarashe Sibanda',
    senderRole: 'landlord',
    text: 'Hello Tendai! Yes, the 50Mbps Liquid fiber connection and 24/7 solar backup are fully inclusive in the $120/month rate. You are welcome to inspect anytime.',
    timestamp: '2026-08-25T09:55:00Z'
  },
  {
    id: 'msg-03',
    conversationId: 'conv-01',
    senderId: 'usr-student-1',
    senderName: 'Tendai Moyo',
    senderRole: 'student',
    text: 'Good day Mr. Sibanda, is it possible to view the room tomorrow at 3 PM after my lecture at NUST?',
    timestamp: '2026-08-25T10:15:00Z'
  },
  {
    id: 'msg-scam-01',
    conversationId: 'conv-02-scam-demo',
    senderId: 'usr-landlord-unverified',
    senderName: 'Prince "Realtor" Gumbo (Unverified)',
    senderRole: 'landlord',
    text: 'If you want this studio you must pay deposit first $40 EcoCash now before 2pm or I give it to another student.',
    timestamp: '2026-08-24T08:10:00Z',
    isSystemWarning: true,
    flaggedScamPhrases: ['pay deposit first', 'ecocash']
  },
  {
    id: 'msg-scam-02',
    conversationId: 'conv-02-scam-demo',
    senderId: 'usr-student-1',
    senderName: 'Tendai Moyo',
    senderRole: 'student',
    text: 'Can I please come with my brother to view it physically first at Jacaranda drive?',
    timestamp: '2026-08-24T08:12:00Z'
  },
  {
    id: 'msg-scam-03',
    conversationId: 'conv-02-scam-demo',
    senderId: 'usr-landlord-unverified',
    senderName: 'Prince "Realtor" Gumbo (Unverified)',
    senderRole: 'landlord',
    text: 'No viewings without booking fee to reserve keys. Send money before you see.',
    timestamp: '2026-08-24T08:14:00Z',
    isSystemWarning: true,
    flaggedScamPhrases: ['booking fee to reserve', 'send money before you see']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    listingId: 'list-101',
    studentId: 'usr-student-past-1',
    studentName: 'Blessing Sithole (BSc Informatics)',
    isVerifiedPastTenant: true,
    tenancyPeriod: 'Feb 2025 - Nov 2025',
    rating: 5,
    subRatings: {
      safety: 5,
      utilitiesReliability: 5,
      landlordResponsiveness: 5,
      valueForMoney: 4.8
    },
    comment: 'Best student housing in Riverside. The solar electricity literally never cut during study exams, and Mr. Sibanda never once asked for shady upfront money. Clean contract and full deposit refund at year end.',
    createdAt: '2025-12-05T10:00:00Z'
  },
  {
    id: 'rev-02',
    listingId: 'list-101',
    studentId: 'usr-student-past-2',
    studentName: 'Nothando Ncube (Applied Chemistry)',
    isVerifiedPastTenant: true,
    tenancyPeriod: 'Aug 2025 - Jun 2026',
    rating: 5,
    subRatings: {
      safety: 5,
      utilitiesReliability: 5,
      landlordResponsiveness: 4.5,
      valueForMoney: 4.7
    },
    comment: 'Super close to campus (10 min walk to main gate). Very secure electric gate, fast internet for Zoom lectures.',
    createdAt: '2026-06-20T15:20:00Z'
  },
  {
    id: 'rev-03',
    listingId: 'list-102',
    studentId: 'usr-student-past-3',
    studentName: 'Rutendo Mpofu (Accounting)',
    isVerifiedPastTenant: true,
    tenancyPeriod: 'Jan 2025 - Dec 2025',
    rating: 4.8,
    subRatings: {
      safety: 5,
      utilitiesReliability: 4.6,
      landlordResponsiveness: 5,
      valueForMoney: 4.5
    },
    comment: 'Mrs. Khumalo is like a campus mother. Strict security rules keep the compound very safe for female students.',
    createdAt: '2026-01-10T12:00:00Z'
  }
];

export const INITIAL_ROOMMATES: RoommateProfile[] = [
  {
    id: 'rm-01',
    studentId: 'usr-student-1',
    name: 'Tendai Moyo',
    program: 'BSc Computer Science (Year 2)',
    institution: 'National University of Science and Technology',
    budgetPerPersonUsd: 80,
    preferredSuburbs: ['Riverside', 'Selborne Park'],
    studyHabits: 'Night owl, quiet coder, library during daytime',
    cleanliness: 'High cleanliness standard, shared rota strictly respected',
    bio: 'Looking for a focused, non-smoking roommate to share a 2-bedroom verified cottage in Riverside or Selborne Park. Love tech, quiet study evenings.',
    lookingForGender: 'any',
    verifiedStudent: true
  },
  {
    id: 'rm-02',
    studentId: 'usr-student-rm2',
    name: 'Farai Katsande',
    program: 'BSc Electronic Engineering (Year 3)',
    institution: 'National University of Science and Technology',
    budgetPerPersonUsd: 70,
    preferredSuburbs: ['Riverside', 'Woodlands'],
    studyHabits: 'Early riser (5 AM), quiet study group host',
    cleanliness: 'Organized and respectful of communal kitchen spaces',
    bio: 'Looking to split a secure, solar-powered cottage. I have my own backup Wi-Fi router if needed.',
    lookingForGender: 'male_only',
    verifiedStudent: true
  },
  {
    id: 'rm-03',
    studentId: 'usr-student-rm3',
    name: 'Tariro Hove',
    program: 'MBChB Medicine (Year 1)',
    institution: 'NUST Medical School / Mpilo Hospital Campus',
    budgetPerPersonUsd: 110,
    preferredSuburbs: ['Selborne Park', 'Bradfield'],
    studyHabits: 'Intense revision schedule, needs peaceful environment',
    cleanliness: 'Very tidy, non-drinker',
    bio: 'Medical student searching for a fellow studious co-tenant in a safe, borehole-backed apartment.',
    lookingForGender: 'female_only',
    verifiedStudent: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    actorId: 'usr-admin-1',
    actorName: 'Chipo Marere (Safety Officer)',
    actorRole: 'admin',
    actionType: 'landlord_verified',
    targetEntityId: 'usr-landlord-1',
    targetEntityType: 'user',
    details: 'Verified Mr. Simbarashe Sibanda via Bulawayo Deeds Registry verification DEED-BYO-2018-9941.',
    timestamp: '2025-11-16T14:00:00Z'
  },
  {
    id: 'aud-02',
    actorId: 'usr-housing-officer-1',
    actorName: 'T. Sibindi (Campus Housing Rep)',
    actorRole: 'housing_office',
    actionType: 'physical_visit_logged',
    targetEntityId: 'list-101',
    targetEntityType: 'listing',
    details: 'Physical verification inspection passed for 14 Jacaranda Cres (Riverside). Upgraded badge to Physically Verified.',
    timestamp: '2026-08-19T11:30:00Z'
  },
  {
    id: 'aud-03',
    actorId: 'system_guardian',
    actorName: 'StayVerify Automated Shield',
    actorRole: 'admin',
    actionType: 'listing_auto_suspended',
    targetEntityId: 'list-104-suspicious',
    targetEntityType: 'listing',
    details: 'Listing 104 reached report threshold (2 scam reports). Automatic lock initiated pending admin investigation.',
    timestamp: '2026-08-24T09:35:00Z'
  }
];

export const DEFAULT_STUDENT_PREFERENCES: StudentPreferences = {
  minBudgetUsd: 40,
  maxBudgetUsd: 150,
  preferredRoomType: ['single', 'two_sharing'],
  maxDistanceKm: 2.5,
  genderPreference: 'any',
  suburbs: ['Riverside', 'Selborne Park', 'Woodlands'],
  requiredAmenities: ['Solar Power (24/7)', 'Borehole Water', 'Fiber Wi-Fi'],
  studyHabit: 'quiet_night_owl',
  cleanlinessStandard: 'very_strict',
  dietaryOrLifestyle: ['non_smoker', 'study_hours_respect']
};
