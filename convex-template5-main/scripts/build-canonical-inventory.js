const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-settings-route-inventory.json', 'utf8'));

// Canonical categorization preserving all 164 unique states
// Grouped into the 7 primary navigation families:
// 1. General (32)
// 2. Employee (9)
// 3. Payroll (28)
// 4. Income Tax (11)
// 5. Leave (24)
// 6. Integrations (3)
// 7. More (57) -> Nested: Help Desk (6), Claims (8), Attendance (19), Letters (3), Advanced / Misc (21)

const canonical = {
  metadata: {
    totalSubmenus: 164,
    source: "Victor Chasex greytHR Angular State Definitions",
    categoryCounts: {
      "General": raw.General.length,
      "Employee": raw.Employee.length,
      "Payroll": raw.Payroll.length,
      "Income Tax": raw["Income Tax"].length,
      "Leave": raw.Leave.length,
      "Integrations": raw.Integrations.length,
      "More": raw.More.length
    }
  },
  categories: raw
};

fs.writeFileSync(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-canonical-164-inventory.json',
  JSON.stringify(canonical, null, 2),
  'utf8'
);

console.log('Saved canonical inventory. Category counts:');
console.log(canonical.metadata.categoryCounts);
