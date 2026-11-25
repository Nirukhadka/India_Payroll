const fs = require('fs');
const submenus = JSON.parse(fs.readFileSync('docs/greythr-settings-parsed-submenus.json', 'utf8'));

// Group by top-level section: General, Employee, Payroll, Income Tax, Leave, Integrations, More (Letter, Claims, Attendance, Helpdesk, Advanced)
const groups = {
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
  if (parts.length < 2) continue;
  const section = parts[1];
  if (section === 'general') {
    groups.General.push(s);
  } else if (section === 'employee') {
    groups.Employee.push(s);
  } else if (section === 'payroll') {
    groups.Payroll.push(s);
  } else if (section === 'income-tax') {
    groups['Income Tax'].push(s);
  } else if (section === 'leave') {
    groups.Leave.push(s);
  } else if (section === 'integrations') {
    groups.Integrations.push(s);
  } else {
    groups.More.push(s);
  }
}

for (const [k, v] of Object.entries(groups)) {
  console.log(`=== ${k} (${v.length} items) ===`);
  v.forEach(item => {
    console.log(`  - [${item.title}] state: ${item.state} -> /ngapp/settings/${item.state.replace(/^settings\./, '').replace(/\./g, '/')}`);
  });
}

fs.writeFileSync('docs/greythr-settings-route-inventory.json', JSON.stringify(groups, null, 2));
