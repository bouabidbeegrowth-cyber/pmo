/**
 * One-off runner: creates the default "Yosra Torjmen" popup for the active
 * event without touching anything else. Safe to re-run — no-ops if a popup
 * with that name already exists for the active event.
 *
 * Run with: npx tsx prisma/seed-popup.ts
 */
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()
const REMOTE = "https://www.pmomastery.tn"

async function main() {
  const event = await db.event.findFirst({ where: { isActive: true } })
  if (!event) {
    console.log("No active event — skipping.")
    return
  }

  const existing = await db.popup.findFirst({ where: { eventId: event.id, name: "Yosra Torjmen" } })
  if (existing) {
    console.log("✓ Popup already exists — skipping.")
    return
  }

  await db.popup.create({
    data: {
      eventId: event.id,
      name: "Yosra Torjmen",
      photo: `${REMOTE}/assets/img/team/yosra.png`,
      messageFr: "Ne manquez pas cet atelier PMO exclusif !",
      messageEn: "Don't miss this exclusive PMO workshop!",
      ctaUrl: "/pass-formation",
      isActive: true,
      displayOrder: 0,
    },
  })
  console.log("✓ Popup created")
}

main()
  .catch((e) => {
    console.error("❌ Popup seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
