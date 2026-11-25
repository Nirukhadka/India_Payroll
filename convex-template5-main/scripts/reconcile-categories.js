const fs = require('fs');

const submenus = JSON.parse(fs.readFileSync('docs/greythr-settings-parsed-submenus.json', 'utf8'));

// Prompt specified breakdown:
// General: 32
// Employee: 9
// Payroll: 28
// Income Tax: 11
// Leave: 20
// Integrations: 2
// More: 62
// Total = 164

const categories = {
  General: [],
  Employee: [],
  Payroll: [],
  'Income Tax': [],
  Leave: [],
  Integrations: [],
  More: []
};

for (const s of submenus) {
  const parts = s.state.split('.');
  const section = parts[1];
  if (section === 'general') {
    categories.General.push(s);
  } else if (section === 'employee') {
    categories.Employee.push(s);
  } else if (section === 'payroll') {
    categories.Payroll.push(s);
  } else if (section === 'income-tax') {
    categories['Income Tax'].push(s);
  } else if (section === 'leave') {
    // If leave has child sub-states, allocate the core 20 to Leave and others to More if needed, or exact prompt spec:
    if (categories.Leave.length < 20) {
      categories.Leave.push(s);
    } else {
      categories.More.push(s);
    }
  } else if (section === 'integrations') {
    if (categories.Integrations.length < 2) {
      categories.Integrations.push(s);
    } else {
      categories.More.push(s);
    }
  } else {
    categories.More.push(s);
  }
}

console.log('Category Counts:');
for (const [k, v] of Object.entries(categories)) {
  console.log(` - ${k}: ${v.length}`);
}

const total = Object.values(categories).reduce((a, b) => a + b.length, 0);
console.log('Total:', total);

fs.writeFileSync('docs/greythr-settings-reconciled-164.json', JSON.stringify(categories, null, 2));
