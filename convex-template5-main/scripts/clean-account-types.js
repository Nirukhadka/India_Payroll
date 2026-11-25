const fs = require('fs');
let code = fs.readFileSync('packages/backend/convex/accountSettings.ts', 'utf8');

code = code.replace(/async function getActiveWorkspace\(ctx: any\)/g, 'async function getActiveWorkspace(ctx: import("./_generated/server").QueryCtx | import("./_generated/server").MutationCtx)');
code = code.replace(/\(q: any\)/g, '(q)');
code = code.replace(/_id: "seed_inv_1" as any/g, '_id: "seed_inv_1" as unknown as import("./_generated/dataModel").Id<"accountInvoices">');
code = code.replace(/_id: "seed_inv_2" as any/g, '_id: "seed_inv_2" as unknown as import("./_generated/dataModel").Id<"accountInvoices">');
code = code.replace(/_id: "seed_pmt_1" as any/g, '_id: "seed_pmt_1" as unknown as import("./_generated/dataModel").Id<"accountPayments">');
code = code.replace(/_id: "seed_tkt_1" as any/g, '_id: "seed_tkt_1" as unknown as import("./_generated/dataModel").Id<"accountTickets">');
code = code.replace(/_id: "seed_tkt_2" as any/g, '_id: "seed_tkt_2" as unknown as import("./_generated/dataModel").Id<"accountTickets">');
code = code.replace(/_id: "seed_tkt_3" as any/g, '_id: "seed_tkt_3" as unknown as import("./_generated/dataModel").Id<"accountTickets">');
code = code.replace(/tickets = seedTickets as any;/g, 'tickets = seedTickets as unknown as typeof tickets;');
code = code.replace(/\(t: any\)/g, '(t)');
code = code.replace(/\(f: any\)/g, '(f)');

fs.writeFileSync('packages/backend/convex/accountSettings.ts', code, 'utf8');
console.log('Cleaned any types');
