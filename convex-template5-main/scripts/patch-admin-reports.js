const fs = require('fs');

let content = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/page.tsx', 'utf8');

// Ensure selectedState is supported in admin/reports as well
if (!content.includes('selectedState')) {
  content = content.replace(
    'const [searchTerm, setSearchTerm] = useState("");',
    `const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("Karnataka");`
  );

  // Update filter logic
  const oldFilter = `const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFav = activeTab === "all" || favoriteIds.has(r.id);
      return matchesSearch && matchesFav;`;

  const newFilter = `const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFav = activeTab === "all" || favoriteIds.has(r.id);

      let matchesState = true;
      if (selectedState !== "All") {
        if (cat.category.includes("Karnataka") && selectedState !== "Karnataka") {
          matchesState = false;
        } else if (cat.category.includes("Tamil Nadu") && selectedState !== "Tamil Nadu") {
          matchesState = false;
        }
      }

      return matchesSearch && matchesFav && matchesState;`;

  content = content.replace(oldFilter, newFilter);

  // Add the state selector to the toolbar
  const toolbarTarget = '<div className="flex items-center gap-2">';
  const toolbarReplacement = `<div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
              <span className="text-slate-500 font-medium">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Jurisdiction State"
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="All">All States / Central</option>
              </select>
            </div>`;

  content = content.replace(toolbarTarget, toolbarReplacement);
  fs.writeFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/page.tsx', content, 'utf8');
  console.log('Successfully enhanced (admin)/admin/reports/page.tsx with state selector');
} else {
  console.log('Admin reports already has selectedState');
}
