const fs = require('fs');
const path = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/unite-marketplace-view.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add useWorkspace import if not present
if (!content.includes('useWorkspace')) {
  content = content.replace(
    'import { useMutation, useQuery } from "convex/react";',
    'import { useMutation, useQuery } from "convex/react";\nimport { useWorkspace } from "@/lib/useWorkspace";'
  );
}

// 2. Replace the brittle api.workspaces.listWorkspaces call with standard useWorkspace + api.orgs.myWorkspaces fallback
const oldUsage = `  const workspaces = useQuery(api.workspaces.listWorkspaces);
  const currentWorkspace = workspaces?.[0];
  const workspaceId = currentWorkspace?._id as Id<"workspaces"> | undefined;`;

const newUsage = `  // Robust workspace context resolution: use standard app workspace provider with reactive fallback
  const { current: ctxWorkspaceId, workspaces: ctxWorkspaces } = useWorkspace();
  let remoteWorkspaces: any = undefined;
  try {
    remoteWorkspaces = useQuery((api as any)?.orgs?.myWorkspaces ?? "orgs:myWorkspaces");
  } catch (e) {
    remoteWorkspaces = undefined;
  }
  const workspaceId = (ctxWorkspaceId ?? remoteWorkspaces?.[0]?._id ?? ctxWorkspaces?.[0]?._id) as Id<"workspaces"> | undefined;`;

if (content.includes(oldUsage)) {
  content = content.replace(oldUsage, newUsage);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully updated unite-marketplace-view.tsx with robust workspace resolution!');
} else {
  console.log('Could not find oldUsage in unite-marketplace-view.tsx');
}
