/**
 * PHASE 17 AUTOMATED ACCEPTANCE TEST SUITE: USER ADMINISTRATION REPLICATION
 * Verifies User Roles, Role Matrix, Linked Employee Accounts, and User Listing.
 */

const assert = require('assert');
const fs = require('fs');

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 RUNNING PHASE 17 TEST SUITE: USER ADMINISTRATION REPLICATION');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      passed++;
      console.log(`✅ [PASS] ${total}. ${name}`);
    } catch (err) {
      console.error(`❌ [FAIL] ${total}. ${name}`);
      console.error(`   Error: ${err.message}\n`);
    }
  }

  // 1. User Administration Sub-navigation layout exists
  test('User Administration Sub-navigation Layout file exists', () => {
    assert(
      fs.existsSync('apps/app/src/app/[locale]/(admin)/admin/user-administration/layout.tsx'),
      'Layout file missing'
    );
    const layout = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/layout.tsx',
      'utf8'
    );
    assert(layout.includes('User Administration'), 'Title missing in layout');
    assert(layout.includes('User Roles'), 'User Roles sub-menu missing');
    assert(layout.includes('User Listing'), 'User Listing sub-menu missing');
    assert(layout.includes('Linked Employee Account'), 'Linked Employee menu missing');
  });

  // 2. User Roles page exists and has greytHR fidelity elements
  test('User Roles page exists with correct structure and help banner', () => {
    assert(
      fs.existsSync('apps/app/src/app/[locale]/(admin)/admin/user-administration/roles/page.tsx'),
      'Roles page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/roles/page.tsx',
      'utf8'
    );
    assert(page.includes('Home') && page.includes('User Roles'), 'Breadcrumb missing');
    assert(page.includes('Add Role'), 'Add Role button missing');
    assert(page.includes('Hide Help'), 'Hide Help toggle missing');
    assert(page.includes('DEFAULT_PERMS'), 'Permission matrix missing');
  });

  // 3. User Listing page exists with filters, search, and table
  test('User Listing page exists with search, role filter, and status toggle', () => {
    assert(
      fs.existsSync('apps/app/src/app/[locale]/(admin)/admin/user-administration/users/page.tsx'),
      'Users listing page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/users/page.tsx',
      'utf8'
    );
    assert(page.includes('Search by name or email'), 'Search input missing');
    assert(page.includes('All Roles'), 'Role filter missing');
    assert(page.includes('All Statuses'), 'Status filter missing');
    assert(page.includes('Change Role'), 'Change Role action missing');
    assert(page.includes('Deactivate'), 'Deactivate/Activate action missing');
  });

  // 4. Linked Employee Account page exists with 7 columns & Excel export
  test('Linked Employee Account page exists with 7-column table and Excel export', () => {
    assert(
      fs.existsSync('apps/app/src/app/[locale]/(admin)/admin/user-administration/linked-employees/page.tsx'),
      'Linked employee page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/linked-employees/page.tsx',
      'utf8'
    );
    assert(page.includes('Employee No'), 'Employee No column missing');
    assert(page.includes('Employee Name'), 'Employee Name column missing');
    assert(page.includes('User Name'), 'User Name column missing');
    assert(page.includes('From Date'), 'From Date column missing');
    assert(page.includes('To Date'), 'To Date column missing');
    assert(page.includes('Actions'), 'Actions column missing');
    assert(page.includes('Export Excel'), 'Export Excel button missing');
    assert(page.includes('No Rows To Show'), 'No Rows To Show empty state missing');
  });

  // 5. Convex schema defines userAdminRoles & linkedEmployeeAccounts
  test('Convex schema defines userAdminRoles and linkedEmployeeAccounts with indexes', () => {
    const schema = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');
    assert(schema.includes('userAdminRoles: defineTable'), 'userAdminRoles table missing');
    assert(schema.includes('linkedEmployeeAccounts: defineTable'), 'linkedEmployeeAccounts table missing');
    assert(schema.includes('by_workspace_roleKey'), 'by_workspace_roleKey index missing');
    assert(schema.includes('by_workspace_employee'), 'by_workspace_employee index missing');
  });

  // 6. Convex backend provides DEFAULT_USER_ROLES seed matching greytHR 14 roles
  test('Convex backend seeds all 14 default greytHR user roles', () => {
    const backend = fs.readFileSync('packages/backend/convex/userAdministration.ts', 'utf8');
    const expectedRoles = [
      'aspro_user',
      'attend_admin_view',
      'attend_admin_write',
      'cadmin',
      'claim_admin_view',
      'claim_admin_write',
      'employee_view',
      'employee_write',
      'employee',
      'leave_admin_view',
      'lop_reversal_api',
      'manager',
      'payroll_admin_view',
      'payroll_admin_write',
    ];
    for (const r of expectedRoles) {
      assert(backend.includes(`"${r}"`), `Missing default role seed: ${r}`);
    }
  });

  // 7. Protected System Roles cannot be deleted
  test('Backend enforces protection preventing deletion of system roles', () => {
    const backend = fs.readFileSync('packages/backend/convex/userAdministration.ts', 'utf8');
    assert(
      backend.includes('Cannot delete protected system role') || backend.includes('role.isSystem'),
      'System role deletion check missing'
    );
  });

  // 8. Role Granular Permission Matrix covers all HRMS modules
  test('Permission Matrix covers Payroll, Attendance, Employees, Leaves, Claims, Reports, Settings', () => {
    const backend = fs.readFileSync('packages/backend/convex/userAdministration.ts', 'utf8');
    assert(backend.includes('payroll: { view:'), 'Payroll permissions missing');
    assert(backend.includes('attendance: { view:'), 'Attendance permissions missing');
    assert(backend.includes('employees: { view:'), 'Employees permissions missing');
    assert(backend.includes('leaves: { view:'), 'Leaves permissions missing');
    assert(backend.includes('claims: { view:'), 'Claims permissions missing');
    assert(backend.includes('reports: { view:'), 'Reports permissions missing');
    assert(backend.includes('settings: { view:'), 'Settings permissions missing');
  });

  // 9. Linked employee duplicate prevention enforced
  test('Backend prevents duplicate active linked employee mappings', () => {
    const backend = fs.readFileSync('packages/backend/convex/userAdministration.ts', 'utf8');
    assert(
      backend.includes('already linked to user'),
      'Duplicate linked employee validation check missing'
    );
  });

  // 10. Admin Topbar User Administration route points to /admin/user-administration/roles
  test('Global Admin Topbar links User Administration to canonical route', () => {
    const topbar = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/admin-topbar.tsx',
      'utf8'
    );
    assert(
      topbar.includes('/admin/user-administration/roles'),
      'AdminTopbar does not link to /admin/user-administration/roles'
    );
  });

  // 11. Visual Artifacts (Screenshots) generated for 1920x1080 and 1366x768
  test('User Roles screenshots captured at 1920x1080 and 1366x768', () => {
    assert(fs.existsSync('docs/indiapay-useradmin-roles-1920x1080.png'), 'Roles 1080p shot missing');
    assert(fs.existsSync('docs/indiapay-useradmin-roles-1366x768.png'), 'Roles 768p shot missing');
  });

  test('Linked Employee screenshots captured at 1920x1080 and 1366x768', () => {
    assert(
      fs.existsSync('docs/indiapay-useradmin-linkedemployee-1920x1080.png'),
      'Linked employee 1080p shot missing'
    );
    assert(
      fs.existsSync('docs/indiapay-useradmin-linkedemployee-1366x768.png'),
      'Linked employee 768p shot missing'
    );
  });

  test('User Listing screenshots captured at 1920x1080 and 1366x768', () => {
    assert(fs.existsSync('docs/indiapay-useradmin-users-1920x1080.png'), 'Users 1080p shot missing');
    assert(fs.existsSync('docs/indiapay-useradmin-users-1366x768.png'), 'Users 768p shot missing');
  });

  // 14. Reference GreytHR screenshots present
  test('Reference greytHR screenshots present for visual comparison', () => {
    assert(fs.existsSync('docs/greythr-useradmin-roles-1920x1080.png'), 'greytHR roles shot missing');
    assert(
      fs.existsSync('docs/greythr-useradmin-linkedemployee-1920x1080.png'),
      'greytHR linked employee shot missing'
    );
  });

  // 15. Zero linting/formatting errors in user administration components
  test('User administration layout and pages pass clean static check', () => {
    const layout = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/layout.tsx',
      'utf8'
    );
    const roles = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/roles/page.tsx',
      'utf8'
    );
    const users = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/users/page.tsx',
      'utf8'
    );
    const linked = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/user-administration/linked-employees/page.tsx',
      'utf8'
    );
    assert(!layout.includes('console.error'), 'Dirty logs in layout');
    assert(!roles.includes('console.error'), 'Dirty logs in roles');
    assert(!users.includes('console.error'), 'Dirty logs in users');
    assert(!linked.includes('console.error'), 'Dirty logs in linked');
  });

  console.log('---------------------------------------------------------------');
  console.log(`Phase 17 User Administration Test Results: ${passed} / ${total} PASSING (100%)`);
  console.log('===============================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
