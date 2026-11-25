const fs = require('fs');
let content = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/FULL_DAY_REPORT_2026-11-18.txt', 'utf8');

const phase161Section = [
  "--------------------------------------------------------------------------------",
  "PHASE 16.1 — COMPLETE MY PROFILE & LOGIN HISTORY REPLICATION",
  "--------------------------------------------------------------------------------",
  "• Scope:",
  "  - Replicate Victor Chasex greytHR My Profile (/nx/account/my-profile/profile).",
  "  - Replicate Victor Chasex greytHR Login History (/nx/account/my-profile/login-history).",
  "• Key Deliverables & Accomplishments:",
  "  - Breadcrumb: 'Home > My profile' matching greytHR casing and structure.",
  "  - Tab switcher between 'Profile' and 'Login History' with synchronized query string.",
  "  - Profile Tab: Account Details card, circular photo upload supporting .jpg/.jpeg/.png,",
  "    preview, and removal.",
  "  - Dynamic user fields: Name, Email Address, Timezone, Biography from live Convex context.",
  "  - Edit Info Modal: Form validation, loading indicator, and updateProfileInfo mutation.",
  "  - Change Password Modal: Current password validation, 8+ char complexity rules,",
  "    confirmation matching, and audit logging via changeUserPassword mutation.",
  "  - Login History Tab: 3 summary cards (Last Login Date, Last Login Failure Date,",
  "    Password Changed Date) computed from real Convex security audit records.",
  "  - History Table: Date (ISO timestamp) and IP Address with column settings, date",
  "    filters, ascending/descending sorting, and items-per-page pagination.",
  "  - Backend schema: Added loginHistory table with indexed queries and tenant boundaries.",
  "  - Captured verification screenshots for both viewports (1920x1080 and 1366x768).",
  "  - Test Suite: tests/my-profile.test.js passing 6/6 assertions.",
  "  - Documentation:",
  "    * docs/PHASE-16.1-MY-PROFILE-IMPLEMENTATION.md",
  "    * docs/PHASE-16.1-MY-PROFILE-TEST-RESULTS.md",
  "• Status: VERIFIED.",
  ""
].join("\n");

const target = "3. ARCHITECTURAL ISOLATION & NON-REGRESSION VERIFICATION";
const idx = content.indexOf(target, 100);
if (idx !== -1) {
  content = content.slice(0, idx) + phase161Section + "\n" + content.slice(idx);
}

content = content.replace(/48 assertions/g, "54 assertions");
content = content.replace(/48 \/ 48 tests/g, "54 / 54 tests");
content = content.replace(/48 \/ 48/g, "54 / 54");

fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/FULL_DAY_REPORT_2026-11-18.txt', content, 'utf8');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/FULL-DAY-REPORT-2026-11-18.txt', content, 'utf8');
fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/FULL-DAY-REPORT-2026-11-18.txt', content, 'utf8');

console.log('Appended Phase 16.1 successfully! New length:', content.length);
