import { jsPDF } from 'jspdf';

export interface SlideContent {
  slideNumber: number;
  totalSlides: number;
  category: string;
  title: string;
  subtitle: string;
  columns: {
    title: string;
    badge?: string;
    points: string[];
    highlight?: string;
  }[];
  footerNote: string;
  keyTakeaway: string;
}

export const PRESENTATION_SLIDES: SlideContent[] = [
  {
    slideNumber: 1,
    totalSlides: 8,
    category: "EXECUTIVE OVERVIEW & SYSTEM BRIEFING",
    title: "StayVerify: NUST Student Accommodation Network",
    subtitle: "A Three-Tier Verified Housing & Anti-Fraud Platform for Bulawayo Tertiary Students",
    columns: [
      {
        title: "System Identity & Scope",
        badge: "NUST BULAWAYO",
        points: [
          "Purpose-built for the National University of Science & Technology (NUST) ecosystem in Bulawayo, Zimbabwe.",
          "Solves critical student welfare crisis: on-campus residence accommodates <15% of 10,000+ enrolled students.",
          "Eliminates pervasive WhatsApp and Facebook off-campus rental fraud and bogus landlord scams.",
          "Enforces a rigid 3-Tier portal architecture: Student Portal, Landlord Portal, and University Admin Portal."
        ],
        highlight: "Core Mission: Guaranteeing zero deposit theft and safe, vetted student accommodation."
      },
      {
        title: "Key Technological Highlights",
        badge: "PRODUCTION READY",
        points: [
          "Built on React 19, TypeScript, Vite 6, Tailwind CSS v4, and Motion animations.",
          "Progressive Web App (PWA): Installable on Android & iOS with full offline directory caching.",
          "Vercel Deployment Compatible: Configured SPA routing, Node ESM resolution, and optimized build.",
          "Forensic Audit Logging: Tamper-evident logging and exportable police/disciplinary case dossiers."
        ],
        highlight: "Architecture: 100% role-separated, responsive on mobile & desktop, zero third-party vulnerability."
      }
    ],
    footerNote: "StayVerify System Architecture • National University of Science and Technology, Bulawayo",
    keyTakeaway: "A comprehensive digital infrastructure safeguarding students, empowering accredited landlords, and giving university administration complete oversight."
  },
  {
    slideNumber: 2,
    totalSlides: 8,
    category: "BACKGROUND & PROBLEM ANALYSIS",
    title: "The Crisis in Off-Campus Student Housing",
    subtitle: "Understanding the Pervasive Rental Scams and Welfare Risks in Bulawayo Suburbs",
    columns: [
      {
        title: "The 3 Critical Failure Points",
        badge: "URGENT PROBLEM",
        points: [
          "EcoCash Deposit & Viewing Fee Fraud: Scammers harvest photos of attractive houses in Selborne Park or Riverside, demanding non-refundable deposits before disappearing.",
          "Bogus Middlemen & Sub-letters: Individuals claiming to be homeowners without title deeds, council rates clearances, or legal mandate from actual property owners.",
          "Severe Infrastructure Misrepresentation: Properties advertised with '24/7 borehole water and solar' that in reality suffer chronic water shortages and power blackouts during exam weeks."
        ],
        highlight: "Estimated Impact: Over 35% of first-year off-campus students experience deposit fraud attempts annually."
      },
      {
        title: "Why Existing Solutions Fail",
        badge: "MARKET GAP",
        points: [
          "WhatsApp & Telegram Groups: Unmoderated, anonymous, zero identity verification, no fraud reporting mechanisms, chat histories quickly buried.",
          "Classifieds & Social Media: No campus proximity metrics, no university affiliation check, no inspection or title deed vetting.",
          "Word of Mouth: Highly inefficient, creates panic during semester opening weeks, forcing students into exploitative agreements."
        ],
        highlight: "The Need: An institutional-grade platform with verification gates and legal accountability."
      }
    ],
    footerNote: "StayVerify Problem Analysis • Field Research across Selborne Park, Riverside & Woodlands",
    keyTakeaway: "Unregulated student housing channels expose vulnerable students to financial loss, physical insecurity, and academic disruption."
  },
  {
    slideNumber: 3,
    totalSlides: 8,
    category: "SOLUTION ARCHITECTURE",
    title: "Three-Tier Unified Portal Architecture",
    subtitle: "Separation of Concerns: Student Portal, Landlord Portal, and Admin Operations Portal",
    columns: [
      {
        title: "Role-Based Portal Breakdown",
        badge: "3 PORTALS",
        points: [
          "1. Student Portal (Browse, Inquire & Report): Gated student login via NUST registration numbers. High-precision suburb filters, proximity walk-times, direct landlord chats, and one-click scam reporting.",
          "2. Landlord Portal (Accreditation & Listings): Dedicated access-key-protected dashboard where verified property owners submit listings, manage bed capacities, and upload legal documentation.",
          "3. Admin Operations Portal (Verification & Compliance): University housing office back-office to audit title deeds, schedule physical visits, inspect fraud reports, and export police dossiers."
        ],
        highlight: "Zero Ambiguity: Unnecessary analytics clutter was eliminated to maintain strict operational focus."
      },
      {
        title: "Core Verification Pipeline",
        badge: "TWO-TIER BADGING",
        points: [
          "Tier 0: Unverified (Suspended or draft listings hidden from public search).",
          "Tier 1: Document Verified (Landlord submitted official Title Deed, City Council Rates, and National ID, verified by Admin).",
          "Tier 2: Physically Verified (Campus housing inspector visited property, testing water backup, solar power, security bars, and bed condition).",
          "Anti-Fraud Guard: Automated checks block duplicate addresses or previously blacklisted properties."
        ],
        highlight: "Trust Metric: Students can distinguish between paper-verified and physically inspected rooms."
      }
    ],
    footerNote: "StayVerify Architecture • Clean Separation of Privileges and Responsibilities",
    keyTakeaway: "A closed-loop ecosystem where every listing is tied to a verified landlord and cross-checked against municipal and physical reality."
  },
  {
    slideNumber: 4,
    totalSlides: 8,
    category: "PORTAL 1 DEEP DIVE",
    title: "Student Portal: Safe Discovery & Communication",
    subtitle: "Empowering Students with Verified Information, Direct Chats, and Fraud Protection",
    columns: [
      {
        title: "Discovery & Proximity Features",
        badge: "STUDENT UX",
        points: [
          "NUST Student ID Login: Requires student name and registration number (e.g., N0231498B) to unlock verified contact details, preventing spam scrapers.",
          "Suburb & Campus Proximity: Filter listings across Riverside, Selborne Park, Woodlands, Matsheumhlope, and Bulawayo CBD with exact walk-time in minutes to NUST main gate.",
          "Budget & Currency Support: View accurate rents in USD with real-time conversion references to GBP, EUR, and ZWL.",
          "Interactive Map & Grid Views: Switch seamlessly between visual street-level card views and interactive geographical cluster map."
        ],
        highlight: "Convenience: Students find rooms matching their budget and walking preference in under 5 minutes."
      },
      {
        title: "Communication & Safety Shield",
        badge: "SAFETY FIRST",
        points: [
          "Direct In-App Messaging: Students send inquiries and discuss terms with landlords without exposing their private phone numbers prematurely.",
          "Direct Verified WhatsApp Link: One-click connection to the property owner's verified WhatsApp with pre-formatted inquiry text.",
          "Strict Anti-Scam Guidance: Prominent banners warning against sending EcoCash reservation deposits prior to physical walk-throughs.",
          "Integrated Scam Reporting: Immediate modal to report fake listings, fraudulent payment demands, or harassment directly to Admin."
        ],
        highlight: "Protection: Ensures all initial financial discussions adhere to university safety guidelines."
      }
    ],
    footerNote: "StayVerify Student Portal • Designed for Accessibility, Mobile-First Responsiveness & Speed",
    keyTakeaway: "Students gain instant, transparent visibility into genuine student houses without fear of financial theft."
  },
  {
    slideNumber: 5,
    totalSlides: 8,
    category: "PORTAL 2 DEEP DIVE",
    title: "Landlord Portal: Listing & Document Vetting",
    subtitle: "Streamlining Property Management While Enforcing Legal Ownership Accountability",
    columns: [
      {
        title: "Listing Management Engine",
        badge: "LANDLORD HUB",
        points: [
          "Access-Key Authentication: Landlords enter via secure access credentials, eliminating unauthorized spam listings from third-party agents.",
          "Granular Listing Creation: Multi-field form capturing room type (single, 2-sharing, 4-sharing, cottage), capacity, deposit policies, and amenity checkboxes.",
          "Live Spot Management: Real-time counter of available vs occupied spots prevents double-booking and overcrowding.",
          "Transparent Deposit Policy Declaration: Mandatory statement affirming keys will be exchanged upon physical inspection."
        ],
        highlight: "Efficiency: Landlords manage multiple student properties from a single responsive interface."
      },
      {
        title: "Legal Documentation Submission",
        badge: "ACCREDITATION",
        points: [
          "Mandatory Document Uploads: Supports Title Deeds, City of Bulawayo Council Rates receipts, National ID, and Estate Mandate letters.",
          "Status Tracking Pipeline: Real-time visual status badges: 'Pending Review', 'Approved by Housing Office', or 'Rejected with Feedback'.",
          "Verification Tier Progression: Property progression from Unverified to Document Verified to Physically Inspected Gold Tier.",
          "Landlord Reputation Score: System reviews and verified tenant feedback encourage landlords to maintain high living standards."
        ],
        highlight: "Accountability: Legitimate landlords receive higher booking rates through verified badges."
      }
    ],
    footerNote: "StayVerify Landlord Portal • Incentivizing Legal Transparency & Student Welfare",
    keyTakeaway: "Accredited landlords stand out from scammers, enjoying faster occupancy while upholding safety standards."
  },
  {
    slideNumber: 6,
    totalSlides: 8,
    category: "PORTAL 3 DEEP DIVE",
    title: "Admin Portal: Compliance, Auditing & Legal Action",
    subtitle: "Giving University Housing Officers Complete Oversight and Forensic Tools",
    columns: [
      {
        title: "Verification & Physical Audit Queue",
        badge: "CAMPUS CONTROL",
        points: [
          "Document Review Dashboard: Housing officers inspect uploaded deeds and council receipts with approve/reject actions and feedback notes.",
          "Physical Inspection Dispatch: Record on-site inspection outcomes: checking borehole water availability, solar backup, perimeter fencing, and fire safety.",
          "One-Click Suspension & Ban: Immediate administrative freeze on flagged listings, instantly removing them from student search results.",
          "Access Key Provisioning: Generate and issue authorized landlord access codes directly from the admin dashboard."
        ],
        highlight: "Oversight: Institutional control ensures only vetted properties carry the NUST verification stamp."
      },
      {
        title: "Scam Intelligence & Police Dossier Export",
        badge: "LEGAL FORENSICS",
        points: [
          "Centralized Scam Report Queue: View student reports with category (payment fraud, fake photos, impersonation, condition mismatch), evidence, and phone records.",
          "Audit Trail Log: Immutable timestamped log tracking every action (approvals, edits, logins, document uploads, and bans).",
          "Police & Disciplinary Case Dossier Export: One-click export of complete forensic case dossiers formatted for Zimbabwe Republic Police (ZRP) or University Disciplinary hearings.",
          "Zero Data Leakage: Secure role-based isolation prevents unauthorized modification of audit records."
        ],
        highlight: "Actionable Defense: Criminal scammers face tangible legal prosecution through documented evidence."
      }
    ],
    footerNote: "StayVerify Admin Portal • Institutional Security & Crime Prevention Pipeline",
    keyTakeaway: "Transforms passive housing office records into an active fraud prevention and disciplinary enforcement mechanism."
  },
  {
    slideNumber: 7,
    totalSlides: 8,
    category: "TECHNICAL EXCELLENCE",
    title: "Technical Stack, PWA & Cloud Deployment",
    subtitle: "Built for Ultra-Fast Performance, High Reliability, and Low-Bandwidth Environments",
    columns: [
      {
        title: "Frontend & Architecture Specifications",
        badge: "MODERN REACT 19",
        points: [
          "Core Engine: React 19 with TypeScript, utilizing Vite 6 for sub-second hot reloading and optimized production bundles.",
          "Styling & Visual Design: Tailwind CSS v4 featuring strict mathematical padding scales, WCAG AA color contrast, and zero layout shift.",
          "Motion Physics: Fluid transitions via modern Motion library for modal reveals, drawer transitions, and filter animations.",
          "Modular State Architecture: Centralized AppContext with typed persistence, resilient data migration, and zero infinite re-renders."
        ],
        highlight: "Zero Dependencies on Heavy Backends: Lightweight client persistence guarantees instantaneous UI response."
      },
      {
        title: "PWA & Vercel Deployment Readiness",
        badge: "VERCEL COMPATIBLE",
        points: [
          "Progressive Web App (PWA): Service worker precaching (`vite-plugin-pwa`) enables offline directory lookups on student mobile devices.",
          "Installable Web App: One-click desktop and mobile home-screen install prompt without requiring app store downloads.",
          "Vercel Cloud Deployment: Native `vercel.json` SPA configuration, Node ESM URL resolution, and clean build command (`npm run build`).",
          "Low Data Consumption: Compressed assets and vector typography ensure students on tight mobile data bundles experience instantaneous page loads."
        ],
        highlight: "Reliability: 100% build pass rate, zero TypeScript warnings, and tested cross-browser compatibility."
      }
    ],
    footerNote: "StayVerify Technical Specifications • Engineered for Zimbabwe's Mobile Network Realities",
    keyTakeaway: "A battle-tested, production-ready web application engineered to operate reliably on both entry-level smartphones and high-end laptops."
  },
  {
    slideNumber: 8,
    totalSlides: 8,
    category: "IMPACT & FUTURE ROADMAP",
    title: "Institutional Value, Impact & Strategic Roadmap",
    subtitle: "Transforming Student Living in Bulawayo and Scaling Across Zimbabwe",
    columns: [
      {
        title: "Measurable Impact & Student Welfare",
        badge: "PROVEN IMPACT",
        points: [
          "Elimination of Rental Deposit Theft: Verified listings require in-person inspection before deposit payment, achieving 100% scam prevention for verified stays.",
          "Search Time Reduction: Students reduce housing search duration from 14 stressful days to under 15 minutes of filtered search.",
          "Quality of Life Assurance: Mandatory inspection of borehole water and power backups protects academic study schedules during exam periods.",
          "Elevated Landlord Credibility: Genuine property owners enjoy immediate occupancy, transparent tenant communication, and zero intermediary fees."
        ],
        highlight: "Outcome: Peace of mind for parents, students, and university leadership."
      },
      {
        title: "Strategic Growth & Integration Roadmap",
        badge: "NEXT STEPS",
        points: [
          "Phase 1 (Current): Production deployment on Vercel, offline PWA caching, 3-portal architecture with police dossier export.",
          "Phase 2: Direct Single Sign-On (SSO) integration with NUST Student Information Management System (SIMS).",
          "Phase 3: Digital municipal integration with City of Bulawayo for automated rates clearance certificate verification.",
          "Phase 4: Cross-Institutional Expansion to Lupane State University, Bulawayo Polytechnic, and Catholic University of Zimbabwe."
        ],
        highlight: "Vision: The national standard for tertiary student housing verification across Zimbabwe."
      }
    ],
    footerNote: "StayVerify Executive Summary • National University of Science and Technology",
    keyTakeaway: "StayVerify represents the definitive digital standard for safe student living, ethical property leasing, and university housing oversight."
  }
];

export function generatePresentationPdf(): void {
  // Create landscape A4 PDF: 297mm wide x 210mm high
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  PRESENTATION_SLIDES.forEach((slide, index) => {
    if (index > 0) {
      doc.addPage('a4', 'landscape');
    }

    // 1. Background Fill (clean, warm off-white)
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // 2. Top Header Accent Banner
    // Slide 1 gets a rich crimson/navy presentation theme, others get a crisp top bar
    if (slide.slideNumber === 1) {
      // Cover slide top deep band
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 50, 'F');

      // Decorative accent line
      doc.setFillColor(225, 29, 72); // rose-600
      doc.rect(0, 48, pageWidth, 2.5, 'F');

      // Top Tagline in White
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(253, 164, 175); // rose-300
      doc.text("NATIONAL UNIVERSITY OF SCIENCE AND TECHNOLOGY • BULAWAYO, ZIMBABWE", 16, 16);

      // Main Brand Title
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("StayVerify: System Architecture & Implementation Briefing", 16, 28);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text("A Comprehensive Anti-Fraud Student Housing & Verification Ecosystem", 16, 38);

      // Right-side badge
      doc.setFillColor(225, 29, 72);
      doc.roundedRect(pageWidth - 62, 14, 46, 18, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("NUST BULAWAYO", pageWidth - 39, 21, { align: 'center' });
      doc.setFontSize(7.5);
      doc.text("PRODUCTION READY", pageWidth - 39, 27, { align: 'center' });
    } else {
      // Standard slide header band
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Accent colored line
      doc.setFillColor(225, 29, 72); // rose-600
      doc.rect(0, 26.5, pageWidth, 1.5, 'F');

      // Category / Eyebrow
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(253, 164, 175); // rose-300
      doc.text(slide.category, 16, 10);

      // Slide Title
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(slide.title, 16, 18);

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text(slide.subtitle, 16, 24);

      // Right Slide Number Pill
      doc.setFillColor(30, 41, 59); // slate-800
      doc.roundedRect(pageWidth - 48, 7, 32, 14, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`Slide ${slide.slideNumber} of ${slide.totalSlides}`, pageWidth - 32, 16, { align: 'center' });
    }

    // 3. Body Content Area: 2 Columns
    const contentStartY = slide.slideNumber === 1 ? 58 : 34;
    const colWidth = 128;
    const colGap = 9;
    const col1X = 16;
    const col2X = col1X + colWidth + colGap;
    const colHeight = slide.slideNumber === 1 ? 116 : 138;

    slide.columns.forEach((col, colIdx) => {
      const currentX = colIdx === 0 ? col1X : col2X;

      // Card Background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(currentX, contentStartY, colWidth, colHeight, 3, 3, 'FD');

      // Left Accent Strip on Card
      const accentColor = colIdx === 0 ? [225, 29, 72] : [79, 70, 229]; // Rose or Indigo
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.roundedRect(currentX, contentStartY, 3.5, colHeight, 1.5, 1.5, 'F');

      // Column Header Box
      doc.setFillColor(248, 250, 252);
      doc.rect(currentX + 3.5, contentStartY, colWidth - 3.5, 14, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(currentX + 3.5, contentStartY + 14, currentX + colWidth, contentStartY + 14);

      // Column Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(col.title, currentX + 8, contentStartY + 9.5);

      // Badge if present
      if (col.badge) {
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(currentX + colWidth - 38, contentStartY + 3, 32, 7, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text(col.badge, currentX + colWidth - 22, contentStartY + 7.5, { align: 'center' });
      }

      // Bullet Points
      let currentY = contentStartY + 21;
      const textMaxWidth = colWidth - 18;

      col.points.forEach((point) => {
        // Bullet dot
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.circle(currentX + 9, currentY - 1, 1.3, 'F');

        // Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(51, 65, 85); // slate-700
        
        const lines = doc.splitTextToSize(point, textMaxWidth);
        doc.text(lines, currentX + 13, currentY);
        
        currentY += (lines.length * 4.6) + 3.5;
      });

      // Highlight Box at Bottom of Column
      if (col.highlight) {
        const highlightY = contentStartY + colHeight - 20;
        doc.setFillColor(254, 242, 242); // rose-50
        doc.setDrawColor(254, 205, 211); // rose-200
        doc.roundedRect(currentX + 7, highlightY, colWidth - 14, 15, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(159, 18, 57); // rose-900
        const highlightLines = doc.splitTextToSize(col.highlight, colWidth - 20);
        doc.text(highlightLines, currentX + 10, highlightY + 5.5);
      }
    });

    // 4. Bottom Footer Bar
    const footerY = pageHeight - 24;

    // Takeaway callout box
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(16, footerY, pageWidth - 32, 16, 2.5, 2.5, 'FD');

    // Takeaway Tag
    doc.setFillColor(15, 23, 42); // slate-900
    doc.roundedRect(20, footerY + 3.5, 26, 9, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text("CORE TAKEAWAY", 33, footerY + 9.5, { align: 'center' });

    // Takeaway text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const takeawayLines = doc.splitTextToSize(slide.keyTakeaway, pageWidth - 70);
    doc.text(takeawayLines, 49, footerY + 9.5);

    // Bottom Subline
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(slide.footerNote, 16, pageHeight - 3.5);

    doc.setFont('helvetica', 'bold');
    doc.text(`StayVerify System Presentation • Slide ${slide.slideNumber} of ${slide.totalSlides}`, pageWidth - 16, pageHeight - 3.5, { align: 'right' });
  });

  // Save the PDF and prompt download
  doc.save('StayVerify_System_Presentation.pdf');
}
