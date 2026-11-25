const { execSync } = require('child_process');
try {
  const stdout = execSync(`npx convex run reimbursements:listCategories "{\\"workspaceId\\": \\"jh710s221d6f83n7v6a10m7b717b165q\\"}"`, {
    cwd: 'packages/backend',
    encoding: 'utf8'
  });
  console.log("Success:\n", stdout);
} catch (err) {
  console.log("Error output:\n", err.stdout || err.message);
}
