import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminShell } from "@/components/admin/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/admin/login")

  // Middleware only checks that the JWT is present/valid — it can't see a
  // deactivation that happened after the token was issued. Re-check here so
  // a deactivated admin is bounced out on their very next page load.
  const user = await db.adminUser.findUnique({ where: { id: session.user.id } })
  if (!user || !user.isActive) redirect("/admin/login")

  return <AdminShell>{children}</AdminShell>
}
