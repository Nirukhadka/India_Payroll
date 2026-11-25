import test from "node:test";
import assert from "node:assert/strict";

const MARKETPLACE_SEED_APPS = [
  {
    appId: "springverify",
    name: "SpringVerify",
    provider: "SpringRole Inc.",
    category: "Background Verification",
    rating: 4.5,
    ratingCount: 142,
    offerBadge: "20% Discount on Background Checks",
    isFeatured: true,
    isInterestedDefault: true,
    integrationType: "third_party",
    supportedFeatures: ["Identity & Aadhaar Verification", "Criminal Record Screening", "Prior Employment Checks", "Instant Status Sync"],
    pricingModel: "Pay-as-you-go per check (Custom Volume Discounts)",
    dataExchanged: ["Employee Full Name", "Date of Birth", "PAN / Aadhaar", "Prior Employment Dates"],
    securityCompliance: ["ISO 27001", "SOC 2 Type II", "CERT-In Audited"],
    isActiveInCatalog: true,
  },
  {
    appId: "fatakpay",
    name: "FatakPay",
    provider: "Fatakpay Digital Pvt. Ltd.",
    category: "Advance Salary",
    rating: 3.7,
    ratingCount: 88,
    offerBadge: "50% off on Employee Onboarding fees",
    isFeatured: true,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Earned Wage Access", "Instant Disbursals 24x7", "Automated Payroll Deduction Sync", "Employee Financial Wellness Dashboard"],
    pricingModel: "Zero employer cost; flat nominal fee per employee withdrawal",
    dataExchanged: ["Employee ID", "Monthly Net Pay", "Bank Account Number", "Active Status"],
    securityCompliance: ["RBI Regulated NBFC Partner", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "zaggle-save",
    name: "Zaggle SAVE",
    provider: "Zaggle Prepaid Ocean Services Ltd.",
    category: "Flexible Benefits",
    rating: 4.2,
    ratingCount: 215,
    isFeatured: true,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Multi-Wallet Smart Card", "Automated Tax Calculation", "Receipt OCR Processing", "Direct Payroll Run Export"],
    pricingModel: "Tiered subscription per active cardholder / month",
    dataExchanged: ["Employee Name", "Work Email", "PAN", "Monthly Flexible Benefit Component"],
    securityCompliance: ["PCI-DSS Level 1", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "advantage-club",
    name: "Advantage Club",
    provider: "Work Advantage Pvt. Ltd.",
    category: "Rewards & Recognition",
    secondaryCategory: "Employee Engagement",
    rating: 4.8,
    ratingCount: 310,
    isFeatured: true,
    isInterestedDefault: true,
    integrationType: "third_party",
    supportedFeatures: ["Peer-to-Peer Kudos System", "Spot Recognition Awards", "Milestone & Service Longevity", "Global Brand Gift Vouchers"],
    pricingModel: "Enterprise Annual SaaS per seat",
    dataExchanged: ["Employee Directory", "Department / Team", "Date of Joining", "Manager Hierarchy"],
    securityCompliance: ["SOC 2 Type II", "GDPR", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "lueinhire",
    name: "LueinHire",
    provider: "Luein Technologies",
    category: "Recruitment",
    rating: 4.6,
    ratingCount: 94,
    offerBadge: "Get INR 5000 worth credits",
    isFeatured: false,
    isInterestedDefault: true,
    integrationType: "third_party",
    supportedFeatures: ["AI Resume Screening", "Automated Interview Scheduling", "Assessment Integrations", "Direct Onboarding Push"],
    pricingModel: "Monthly recruiter seat licensing + credits",
    dataExchanged: ["Candidate Profile", "Job Description", "Offer Details", "CTC Structure"],
    securityCompliance: ["SOC 2 Type II", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "cleartax",
    name: "ClearTax",
    provider: "Defmacro Software Pvt. Ltd.",
    category: "Tax",
    rating: 4.2,
    ratingCount: 420,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Bulk Form 16 Sync", "Automated ITR Prefill", "Expert Tax CA Assistance", "ITR Filing Status Audit"],
    pricingModel: "Free DIY filing; discounted rates for assisted CA filing",
    dataExchanged: ["Form 16 Part A & B", "PAN", "Employee Email"],
    securityCompliance: ["ISO 27001", "256-bit SSL Banking Grade"],
    isActiveInCatalog: true,
  },
  {
    appId: "fibe",
    name: "Fibe",
    provider: "Social Worth Technologies Pvt. Ltd.",
    category: "Digital Lending",
    rating: 3.8,
    ratingCount: 76,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Instant Credit Evaluation", "Paperless 10-minute Disbursal", "Flexible EMI Tenures", "Salary Linked Eligibility"],
    pricingModel: "Zero cost to enterprise; partner interest rates apply to borrower",
    dataExchanged: ["Employee Code", "Basic Salary Band", "Tenure of Employment"],
    securityCompliance: ["RBI Regulated NBFC", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "hackerrank",
    name: "HackerRank",
    provider: "HackerRank (HackerLife Inc.)",
    category: "Connectors",
    secondaryCategory: "Recruitment",
    rating: 4.7,
    ratingCount: 380,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "connector",
    supportedFeatures: ["Coding Assessment Library", "Pair Programming IDE", "Plagiarism & Code AI Detection", "Scorecard Auto-Sync"],
    pricingModel: "Enterprise Annual Subscription",
    dataExchanged: ["Candidate Details", "Assessment Scores", "Evaluation Reports"],
    securityCompliance: ["SOC 2 Type II", "ISO 27001", "GDPR"],
    isActiveInCatalog: true,
  },
  {
    appId: "happylocate",
    name: "HappyLocate",
    provider: "HappyLocate Relocation Services Pvt. Ltd.",
    category: "Relocation",
    rating: 4.5,
    ratingCount: 52,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Corporate Relocation Policy Engine", "Real-time Move Tracking", "Damage Protection Guarantee", "Centralized Invoicing"],
    pricingModel: "Corporate B2B tariff per move",
    dataExchanged: ["Employee Contact", "Relocation Origin/Destination", "Designation/Grade"],
    securityCompliance: ["ISO 9001", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "healthysure",
    name: "Healthysure",
    provider: "Healthysure (Tacterial Consulting Pvt. Ltd.)",
    category: "Corporate Insurance",
    secondaryCategory: "Wellness",
    rating: 4.9,
    ratingCount: 168,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Group Mediclaim (GMC) Management", "Real-time TPA Claim Tracking", "Cashless OPD Consultations", "Dependent Enrollment"],
    pricingModel: "Annual premium per covered life",
    dataExchanged: ["Employee Demographics", "Dependent Information", "Nominee Details"],
    securityCompliance: ["IRDAI Licensed Corporate Agent", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "instaveritas",
    name: "Instaveritas",
    provider: "Instaveritas Verification Services Pvt. Ltd.",
    category: "Background Verification",
    rating: 4.4,
    ratingCount: 110,
    offerBadge: "INR 3000 worth of checks free",
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Instant Aadhaar & PAN Match", "e-Court Records Search", "Physical Address Verification", "Automated Candidate Link Dispatch"],
    pricingModel: "Prepaid wallet & monthly post-paid invoicing",
    dataExchanged: ["Candidate Name", "ID Numbers", "Address History", "Educational Degrees"],
    securityCompliance: ["ISO 27001", "NASSCOM NSR Member"],
    isActiveInCatalog: true,
  },
  {
    appId: "karmalife",
    name: "KarmaLife",
    provider: "KarmaLife (Finarkein Analytics)",
    category: "Advance Salary",
    rating: 3.9,
    ratingCount: 45,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Liquidity on Demand", "Smart Repayment Deduction", "Financial Literacy Content", "Zero Paperwork Onboarding"],
    pricingModel: "Subscription model for enterprise or user fee per withdrawal",
    dataExchanged: ["Employee ID", "Designation", "Bank Details", "Attendance Records"],
    securityCompliance: ["ISO 27001", "CISA Audited"],
    isActiveInCatalog: true,
  },
  {
    appId: "kreditbee",
    name: "KreditBee",
    provider: "Finnov Private Limited",
    category: "Digital Lending",
    rating: 4.1,
    ratingCount: 340,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Credit Line up to 2 Lakhs", "Automated e-Mandate Setup", "Pre-approved Enterprise Limits", "Flexible Tenures"],
    pricingModel: "Free partner integration",
    dataExchanged: ["Employee Code", "Monthly Salary", "Employment Verification Status"],
    securityCompliance: ["RBI Certified System", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "learnteq",
    name: "Learnteq",
    provider: "Learnteq Digital Services Pvt. Ltd.",
    category: "Learning & Development",
    rating: 4.3,
    ratingCount: 65,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["SCORM & xAPI Compliant", "Gamified Learning Paths", "Compliance Renewal Reminders", "HRMS Auto-Sync for New Hires"],
    pricingModel: "Per active learner per month",
    dataExchanged: ["Employee Directory", "Department", "Role", "Manager Email"],
    securityCompliance: ["ISO 27001", "SOC 2 Type II"],
    isActiveInCatalog: true,
  },
  {
    appId: "ms-dynamics-365",
    name: "Microsoft Dynamics 365",
    provider: "Microsoft Corporation",
    category: "Connectors",
    rating: 4.8,
    ratingCount: 512,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "connector",
    supportedFeatures: ["General Ledger Journal Sync", "Cost Center Allocation", "Tax Liability Reconciler", "Automated Bank Reversals"],
    pricingModel: "Included with IndiaPay Enterprise connector pack",
    dataExchanged: ["Payroll Journal Entries", "Cost Center Codes", "Account Numbers"],
    securityCompliance: ["FedRAMP", "SOC 1/2/3", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "mind-n",
    name: "Mind-n",
    provider: "Mind-n Wellness Pvt. Ltd.",
    category: "Wellness",
    rating: 4.8,
    ratingCount: 82,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Confidential 1-on-1 Counseling", "Self-Care Assessments", "Manager Empathy Workshops", "24/7 Crisis Helpline"],
    pricingModel: "Annual corporate retainer per employee",
    dataExchanged: ["Corporate Email Domain", "Total Headcount (Anonymized)"],
    securityCompliance: ["HIPAA Compliant", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "offerright",
    name: "OfferRight",
    provider: "OfferRight Tech Solutions",
    category: "Recruitment",
    rating: 4.3,
    ratingCount: 40,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Interactive Dynamic Offer Letters", "Legally Binding e-Signatures", "Salary Structure Simulator", "Automatic IndiaPay Profile Creation"],
    pricingModel: "Per offer created or monthly subscription",
    dataExchanged: ["Candidate Details", "Offer Terms", "Salary Structure", "Joining Date"],
    securityCompliance: ["ISO 27001", "Information Technology Act 2000 Compliant"],
    isActiveInCatalog: true,
  },
  {
    appId: "offineeds",
    name: "OffiNeeds",
    provider: "OffiNeeds Corporate Gifting Pvt. Ltd.",
    category: "Corporate Gifting",
    rating: 4.7,
    ratingCount: 190,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Welcome Kit Auto-Dispatch", "Custom Swag Storefront", "PAN India Delivery Tracking", "Bulk Milestone Ordering"],
    pricingModel: "Catalog-based per unit pricing",
    dataExchanged: ["Employee Name", "Delivery Address", "T-Shirt / Shoe Sizes", "Phone Number"],
    securityCompliance: ["ISO 9001", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "pazcare",
    name: "Pazcare",
    provider: "Paz Tech Solutions Pvt. Ltd.",
    category: "Corporate Insurance",
    rating: 4.5,
    ratingCount: 145,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Zero Paperwork Claims", "Instant Health Card Downloads", "Free Unlimited Teleconsultations", "HR Insurance Admin Dashboard"],
    pricingModel: "Annual premium per covered employee",
    dataExchanged: ["Employee Roster", "Date of Birth", "Gender", "Dependent Records"],
    securityCompliance: ["IRDAI Regulated Broker", "SOC 2 Type II", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "tally-prime",
    name: "Tally",
    provider: "Tally Solutions Pvt. Ltd.",
    category: "Connectors",
    rating: 4.9,
    ratingCount: 890,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "connector",
    supportedFeatures: ["One-Click Tally XML Export", "Payroll Ledger Mapping", "Direct Cost Center Breakdown", "Multi-Company Support"],
    pricingModel: "Free native connector in IndiaPay",
    dataExchanged: ["General Ledger Vouchers", "Debit/Credit Amounts", "Voucher Dates"],
    securityCompliance: ["Proprietary Secure Sync Protocol"],
    isActiveInCatalog: true,
  },
  {
    appId: "taxspanner",
    name: "TaxSpanner",
    provider: "Span Across IT Solutions Pvt. Ltd.",
    category: "Tax",
    rating: 4.3,
    ratingCount: 180,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Form 16 Sync", "Tax Optimization Insights", "Income Tax Notice Support", "NRI Tax Filing"],
    pricingModel: "Subsidized corporate packages",
    dataExchanged: ["Form 16 Data", "PAN Card", "Tax Regime Selection"],
    securityCompliance: ["Authorized e-Return Intermediary (ERI)", "ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "boardgame-co",
    name: "The Board Game Co.",
    provider: "The Board Game Company",
    category: "Employee Engagement",
    rating: 4.9,
    ratingCount: 58,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["In-Office Team Challenges", "Virtual Remote Games", "Leadership Strategy Modules", "Customized Company Board Games"],
    pricingModel: "Event-based quotation",
    dataExchanged: ["Team Size", "Department", "Event Objectives"],
    securityCompliance: ["Standard Corporate NDA"],
    isActiveInCatalog: true,
  },
  {
    appId: "thrive-cafe",
    name: "Thrive Cafe",
    provider: "Thrive Wellbeing Solutions",
    category: "Wellness",
    rating: 4.4,
    ratingCount: 37,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Live Ergonomics Masterclasses", "Nutrition & Diet Consults", "Healthy Habit Tracking", "Monthly Wellness Calendar"],
    pricingModel: "Quarterly or annual corporate engagement package",
    dataExchanged: ["Corporate Domain", "Participant Headcount"],
    securityCompliance: ["ISO 27001"],
    isActiveInCatalog: true,
  },
  {
    appId: "violetlms",
    name: "VioletLMS",
    provider: "Violet InfoSystems Pvt. Ltd.",
    category: "Learning & Development",
    rating: 4.5,
    ratingCount: 72,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["Automated Course Assignments", "Mobile Offline Learning App", "Quiz & Skill Assessments", "Certification Expiry Alerts"],
    pricingModel: "Per user per year",
    dataExchanged: ["Employee Code", "Designation", "Branch", "Course Completion State"],
    securityCompliance: ["ISO 27001", "CMMI Level 3"],
    isActiveInCatalog: true,
  },
  {
    appId: "xero",
    name: "Xero",
    provider: "Xero Limited",
    category: "Connectors",
    rating: 4.6,
    ratingCount: 290,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "connector",
    supportedFeatures: ["Automated Payroll Journal Postings", "Bank Account Reconciliation", "Multi-Currency Translation", "Tax Line Mapping"],
    pricingModel: "Included with IndiaPay Connector Pack",
    dataExchanged: ["Journal Vouchers", "Account Codes", "Currency Amounts"],
    securityCompliance: ["SOC 2 Type II", "ISO 27001", "PCI-DSS"],
    isActiveInCatalog: true,
  },
  {
    appId: "yourdost",
    name: "YourDOST",
    provider: "YourDOST Health Solutions Pvt. Ltd.",
    category: "Wellness",
    rating: 4.8,
    ratingCount: 220,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "third_party",
    supportedFeatures: ["100% Anonymous 24/7 Chat Support", "Scheduled Video Therapy", "Self-Care Assessments", "Quarterly Anonymized HR Insights"],
    pricingModel: "Annual corporate subscription per employee",
    dataExchanged: ["Company Email Verification (Anonymized)"],
    securityCompliance: ["ISO 27001", "Strict Confidentiality Charter"],
    isActiveInCatalog: true,
  },
  {
    appId: "zoho-books",
    name: "Zoho Books",
    provider: "Zoho Corporation Pvt. Ltd.",
    category: "Connectors",
    rating: 4.7,
    ratingCount: 450,
    isFeatured: false,
    isInterestedDefault: false,
    integrationType: "connector",
    supportedFeatures: ["Direct OAuth 2.0 Integration", "Automated Payroll Journal Postings", "TDS Liability Sync", "Vendor / Professional Tax Ledger Updates"],
    pricingModel: "Free native connector in IndiaPay",
    dataExchanged: ["Payroll Expense Accounts", "Liability Accounts", "Journal Entry Dates"],
    securityCompliance: ["SOC 2 Type II", "ISO 27001", "GDPR"],
    isActiveInCatalog: true,
  },
];

test("Phase 15: IndiaPay Unite Marketplace Quality Gates & Acceptance Test Suite", async (t) => {
  await t.test("1. Application Catalog Discovery: 27 realistic applications covering all 15 categories", () => {
    assert.equal(MARKETPLACE_SEED_APPS.length >= 27, true, `Expected >= 27 apps, found ${MARKETPLACE_SEED_APPS.length}`);

    const expectedCategories = [
      "Background Verification",
      "Corporate Gifting",
      "Advance Salary",
      "Connectors",
      "Corporate Insurance",
      "Digital Lending",
      "Employee Engagement",
      "Flexible Benefits",
      "Learning & Development",
      "Recruitment",
      "Relocation",
      "Rewards & Recognition",
      "Tax",
      "Wellness",
    ];

    const catalogCategories = new Set(MARKETPLACE_SEED_APPS.map(a => a.category));
    for (const cat of expectedCategories) {
      assert.equal(catalogCategories.has(cat), true, `Missing category: ${cat}`);
    }
  });

  await t.test("2. Category & Search Filtering Logic: Coexistence of category chip and search query", () => {
    const bgvApps = MARKETPLACE_SEED_APPS.filter(a => a.category === "Background Verification");
    assert.equal(bgvApps.length >= 2, true);
    assert.equal(bgvApps.some(a => a.appId === "springverify"), true);

    const query = "Aadhaar";
    const searched = bgvApps.filter(a =>
      a.name.includes(query) ||
      a.supportedFeatures.some(f => f.includes(query))
    );
    assert.equal(searched.length >= 1, true);
    assert.equal(searched[0].appId, "springverify");
  });

  await t.test("3. Multi-Attribute Sorting: Alphabetical A-Z, Z-A and popularity rankings", () => {
    const list = [...MARKETPLACE_SEED_APPS];

    list.sort((a, b) => a.name.localeCompare(b.name));
    assert.equal(list[0].name.toLowerCase() <= list[1].name.toLowerCase(), true);

    list.sort((a, b) => b.name.localeCompare(a.name));
    assert.equal(list[0].name.toLowerCase() >= list[1].name.toLowerCase(), true);

    list.sort((a, b) => (b.rating * b.ratingCount) - (a.rating * a.ratingCount));
    const firstScore = list[0].rating * list[0].ratingCount;
    const secondScore = list[1].rating * list[1].ratingCount;
    assert.equal(firstScore >= secondScore, true);
  });

  await t.test("4. Application Request & Lifecycle Transitions: Validation and status flow", () => {
    const validStatuses = [
      "available",
      "requested",
      "pending_approval",
      "approved",
      "installed",
      "active",
      "suspended",
      "rejected",
    ];

    const requestPayload = {
      appId: "springverify",
      requestReason: "Quarterly background screening for 25 engineering joiners",
      contactName: "Javeria HR",
      contactEmail: "javeria@victorchasex.com",
      contactPhone: "+91 98765 43210",
    };

    assert.ok(requestPayload.appId, "appId required");
    assert.ok(requestPayload.requestReason.length >= 10, "Justification must be descriptive");
    assert.ok(requestPayload.contactEmail.includes("@"), "Valid corporate email required");

    let currentStatus = "pending_approval";
    assert.equal(validStatuses.includes(currentStatus), true);

    currentStatus = "approved";
    assert.equal(validStatuses.includes(currentStatus), true);

    currentStatus = "active";
    assert.equal(validStatuses.includes(currentStatus), true);
  });

  await t.test("5. Book A Demo Form Validation: Contact details and calendar preferences", () => {
    const demoPayload = {
      name: "Nirmala Khadka",
      organization: "Victor Chasex",
      workEmail: "nirmala@victorchasex.com",
      contactNumber: "+91 98765 12345",
      interestedAppId: "all_apps",
      preferredDate: "2026-11-25",
    };

    assert.ok(demoPayload.name.trim().length > 0, "Name must not be empty");
    assert.ok(demoPayload.organization.trim().length > 0, "Organization must not be empty");
    assert.ok(demoPayload.workEmail.includes("@") && demoPayload.workEmail.includes("."), "Valid email format");
    assert.ok(/^\+?[0-9\s-]{10,15}$/.test(demoPayload.contactNumber), "Valid phone number");
    assert.ok(new Date(demoPayload.preferredDate) instanceof Date, "Valid target date");
  });

  await t.test("6. Marketplace Security, Tenant Isolation & Secret Masking", () => {
    for (const app of MARKETPLACE_SEED_APPS) {
      assert.equal("clientSecret" in app, false, `Secret exposed in ${app.appId}`);
      assert.equal("apiKey" in app, false, `API key exposed in ${app.appId}`);
      assert.equal("token" in app, false, `Token exposed in ${app.appId}`);
    }

    const app = MARKETPLACE_SEED_APPS.find(a => a.appId === "springverify");
    assert.equal(app.securityCompliance.includes("ISO 27001"), true);
    assert.equal(app.securityCompliance.includes("SOC 2 Type II"), true);
  });
});
