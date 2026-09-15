/**
 * One-off runner: seeds just the SeoMeta catalog without touching the
 * event/speakers/etc — seed.ts's main() is destructive (wipes and
 * recreates the whole event), which we don't want here.
 *
 * Run with: SEED_SEO_ONLY=1 npx tsx prisma/seed-seo.ts
 */
import { seedSeoMeta } from "./seed"

seedSeoMeta()
  .then(() => console.log("✓ SEO meta catalog seeded"))
  .catch((e) => {
    console.error("❌ SEO seed failed:", e)
    process.exit(1)
  })
