const fs = require('fs');

// 1. Fix promotional-carousel.tsx
let promo = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/promotional-carousel.tsx', 'utf8');
promo = promo.replace(/key=\{idx\}/g, 'key={slide.id}');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/promotional-carousel.tsx', promo, 'utf8');

// 2. Fix take-tour-modal.tsx
let tour = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/take-tour-modal.tsx', 'utf8');
tour = tour.replace(/key=\{idx\}/g, 'key={`tour_step_${idx}`}');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/take-tour-modal.tsx', tour, 'utf8');

// 3. Fix app-details-modal.tsx
let modal = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/app-details-modal.tsx', 'utf8');
modal = modal.replace(/key=\{idx\}/g, 'key={feat}');
modal = modal.replace(/key=\{i\}/g, 'key={`item_${i}`}');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/app-details-modal.tsx', modal, 'utf8');

// 4. Fix unite-marketplace-view.tsx
let view = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/unite-marketplace-view.tsx', 'utf8');
view = view.replace(/setSelectedApp\(app as any\)/g, 'setSelectedApp(app as unknown as MarketplaceAppDetailsItem)');
view = view.replace(/setSelectedApp\(orgApp\.app as any\)/g, 'setSelectedApp(orgApp.app as unknown as MarketplaceAppDetailsItem)');
view = view.replace(/setSortOption\(e\.target\.value as any\)/g, 'setSortOption(e.target.value as "a_z" | "z_a" | "popular")');
view = view.replace(/key=\{i\}/g, 'key={`feat_${i}`}');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/unite-marketplace-view.tsx', view, 'utf8');

console.log('Fixed array keys and any types in Unite components.');
