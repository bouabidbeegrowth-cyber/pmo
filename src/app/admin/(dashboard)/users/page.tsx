import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PageHeader } from "@/components/admin/page-header"
import { AccountSecurityCard } from "./account-security-card"
import { UserManagement } from "./user-management"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN"

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Utilisateurs"
        description="Gérez votre compte et les accès à l'administration."
      />

      <AccountSecurityCard />

      {isSuperAdmin && session?.user?.id ? (
        <UserManagement currentUserId={session.user.id} />
      ) : (
        <div className="bg-white rounded-2xl shadow-premium p-6 text-sm text-muted-foreground">
          Seuls les super-administrateurs peuvent gérer les autres comptes.
        </div>
      )}
    </div>
  )
}
