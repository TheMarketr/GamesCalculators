import { checkChain, loadRewards, saveRewards } from "./rewards-lib.mjs";
const game = "monopoly-go",
  rows = await loadRewards(game);
let failures = 0;
for (const row of rows) {
  if (row.retired) continue;
  try {
    const result = await checkChain(row.claimUrl, game);
    row.checkedAt = new Date().toISOString();
    if (result.state === "retired") row.retired = true;
  } catch (error) {
    failures++;
    console.error(`${row.id}: ${error.message}; previous check retained.`);
  }
}
await saveRewards(game, rows);
console.log(
  `Checked ${rows.length} source-tracked links; ${failures} unconfirmed. Reachability never proves claim eligibility.`,
);
if (failures) process.exitCode = 1;
