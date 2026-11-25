const fs = require('fs');
let code = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/packages/backend/convex/marketplace.ts', 'utf8');

code = code.replace(/_id: `seed_app_\${idx}` as unknown as any,/, '_id: `seed_app_${idx}` as unknown as import("./_generated/dataModel").Id<"marketplaceApps">,');

code = code.replace(/if \(existing\) \{\s*await ctx\.db\.delete\(existing\._id\);\s*return \{ isInterested: false \};\s*\}\s*\{\s*await ctx\.db\.insert\("marketplaceInterestedApps"/g,
`if (existing) {
      await ctx.db.delete(existing._id);
      return { isInterested: false };
    }
    await ctx.db.insert("marketplaceInterestedApps"`);

code = code.replace(/return \{ isInterested: true \};\s*\}\s*\},/g,
`return { isInterested: true };
  },`);

fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/packages/backend/convex/marketplace.ts', code, 'utf8');
