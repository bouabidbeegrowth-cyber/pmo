/**
 * One-off runner: seeds just the UiText catalog without touching the
 * event/speakers/etc — seed.ts's main() is destructive (wipes and
 * recreates the whole event), which we don't want here.
 *
 * Run with: SEED_UI_TEXT_ONLY=1 npx tsx prisma/seed-ui-text.ts
 */
import { seedUiText } from "./seed"

seedUiText()
  .then(() => console.log("✓ UI text catalog seeded"))
  .catch((e) => {
    console.error("❌ UI text seed failed:", e)
    process.exit(1)
  })
